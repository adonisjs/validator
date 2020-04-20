/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import {
  ParsedRule,
  SchemaArray,
  SchemaObject,
  SchemaLiteral,
  ValidationField,
  ParsedSchemaTree,
  CompilerOutput,
} from '@ioc:Adonis/Core/Validator'

import endent from 'endent'
import { CompilerBuffer } from './Buffer'
import { ArrayCompiler } from './Nodes/Array'
import { ObjectCompiler } from './Nodes/Object'
import { LiteralCompiler } from './Nodes/Literal'

/**
 * Compiler exposes the API to compile the schema tree into a set of Javascript
 * instructions.
 */
export class Compiler {
  /**
   * Reference counters. They are required for node compilers to
   * create safe and unique variable names
   */
  public outVariableCounter: number = 0
  public referenceVariableCounter: number = 0
  public arrayIndexVariableCounter: number = 0

  /**
   * The name of certain properties referenced inside
   * the compiled output
   */
  public COMPILER_REFERENCES = {
    validations: 'validations',
    exists: 'helpers.exists',
    isObject: 'helpers.isObject',
    reportError: 'errorReporter',
  }

  constructor (private schema: ParsedSchemaTree) {
  }

  /**
   * Returns the name of the options object for a given variable
   */
  public getVariableOptionsName (variableName: string) {
    return `${variableName}_options`
  }

  /**
   * Returns the name of the mutation function for a given variable
   */
  public getVariableMutationName (variableName: string) {
    return `mutate_${variableName}`
  }

  /**
   * Returns the name of the variable that holds the boolean about whether
   * original value exists or not. The mutations set value to undefined
   * or null are ignored and neither encouraged.
   */
  public getVariableExistsName (variableName: string) {
    return `${variableName}_exists`
  }

  /**
   * Returns the name of the variable that holds the boolean about whether
   * original value exists or not. The mutations set value to undefined
   * or null are ignored and neither encouraged.
   */
  public getVariableExistsDeclaration (variableName: string) {
    return endent`
      const ${this.getVariableExistsName(variableName)} = ${this.COMPILER_REFERENCES.exists}(${variableName})
    `
  }

  /**
   * Returns the expression to declare the mutation function for a given
   * field.
   */
  public getMutationFnDeclararationExpression (variableName: string) {
    return endent`function ${this.getVariableMutationName(variableName)} (newValue) {
      ${variableName} = newValue;
    }`
  }

  /**
   * Returns the expression to declare the options
   */
  public getOptionsDeclarationExpression (
    variableName: string,
    field: string,
    tip: string,
    pointer: string,
    arrayExpressionPointer?: string,
  ) {
    const arrayExpressionPointerItem = arrayExpressionPointer
      ? `\n  arrayExpressionPointer: ${arrayExpressionPointer},`
      : ''

    return endent`const ${this.getVariableOptionsName(variableName)} = {
      root,
      field: ${field},
      tip: ${tip},
      pointer: ${pointer},${arrayExpressionPointerItem}
      mutate: ${this.getVariableMutationName(variableName)},
      ${this.COMPILER_REFERENCES.reportError}
    }`
  }

  /**
   * Returns the method call expression for executing validation
   * a given rule
   */
  public getValidationCallableExpression (variableName: string, rule: ParsedRule) {
    const compiledOptions = JSON.stringify(rule.compiledOptions)
    const options = this.getVariableOptionsName(variableName)

    /**
     * Use `validateAsync` when rule is async, otherwise use `validate`
     */
    const methodCall = rule.async
      ? `await ${this.COMPILER_REFERENCES.validations}.${rule.name}.validate`
      : `${this.COMPILER_REFERENCES.validations}.${rule.name}.validate`

    /**
     * If rule doesn't want to get executed on undefined values, then make
     * sure to add the `exists` guard first
     */
    const existsGuard = rule.allowUndefineds ? '' : `${this.getVariableExistsName(variableName)} && `

    const callableExpression = `${methodCall}(${variableName}, ${compiledOptions}, ${options})`
    return `${existsGuard}${callableExpression}`
  }

  /**
   * Converts a pointer to a Javascript expression
   */
  public pointerToExpression (pointer: ValidationField) {
    return pointer.type === 'literal' ? `'${pointer.name}'` : pointer.name
  }

  /**
   * Converts an array of pointers to a Javascript expression
   */
  public pointersToExpression (pointer: ValidationField[]) {
    let hasIdentifiers = false

    const pointerExpression = pointer.map((one) => {
      if (one.type === 'identifier') {
        hasIdentifiers = true
        return `\$\{${one.name}}`
      }
      return one.name
    }).join('.')

    return hasIdentifiers ? `\`${pointerExpression}\`` : `'${pointerExpression}'`
  }

  /**
   * Compiles a given node inside the schema tree. The compiled
   * output is written to the buffer
   */
  public compileNode (
    field: string | ValidationField,
    node: SchemaArray | SchemaLiteral | SchemaObject,
    buffer: CompilerBuffer,
    parentPointer: ValidationField[],
    referenceVariable?: string,
    outVariable?: string,
  ) {
    field = typeof (field) === 'string' ? { name: field, type: 'literal' } : field

    /**
     * Reference object for node compilers
     */
    const references = {
      outVariable: outVariable || 'out',
      referenceVariable: referenceVariable || 'root',
      parentPointer,
    }

    switch (node.type) {
      case 'literal':
        new LiteralCompiler(field, node, this, references).compile(buffer)
        break
      case 'object':
        new ObjectCompiler(field, node, this, references).compile(buffer)
        break
      case 'array':
        new ArrayCompiler(field, node, this, references).compile(buffer)
        break
    }
  }

  /**
   * Compiles all nodes for the schema tree recursively. The compiled
   * output is written to the buffer.
   */
  public compileTree (
    tree: ParsedSchemaTree,
    buffer: CompilerBuffer,
    parentPointer: ValidationField[],
    referenceVariable?: string,
    outVariable?: string,
  ) {
    Object.keys(tree).forEach((field) => {
      this.compileNode(field, tree[field], buffer, parentPointer, referenceVariable, outVariable)
    })
  }

  /**
   * Compiles the tree and returns the compiled code as a string.
   */
  public compileAsString () {
    const buffer = new CompilerBuffer()

    /**
     * We wrap the buffer output inside an async function with following arguments.
     *
     * - `root` is the object to validate
     * - `validate` is the function to validate using synchronous rules
     * - `validateAsync` is the function to validate using asynchronous rules
     * - `isObject` checks whether the value is a valid Javascript object
     * - `exists` checks whether the value is defined or not.
     */
    buffer.wrappingCode([
      'return async function (root, validations, errorReporter, helpers) {',
      '}',
    ])

    /**
     * Declaring the out variable. The compiler code will write the
     * validated properties to this variable
     */
    buffer.writeExpression('const out = {}')

    /**
     * Parse the schema
     */
    this.compileTree(this.schema, buffer, [])

    /**
     * Return the out value
     */
    buffer.writeExpression(endent`
      if (errorReporter.hasErrors) {
        throw errorReporter.toError();
      }

      return out
    `, true)
    buffer.dedent()

    /**
     * Return the buffer string
     */
    return buffer.flush()
  }

  /**
   * Compiles the schema tree to an executable function
   */
  public compile<T extends any> (): CompilerOutput<T> {
    return new Function('root', 'validations', 'errorReporter', 'helpers', this.compileAsString())()
  }
}

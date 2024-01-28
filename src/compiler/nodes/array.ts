/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Compiler } from '../index.js'
import { LiteralCompiler } from './literal.js'
import { CompilerBuffer } from '../buffer/index.js'
import type { SchemaArray, SchemaObject, SchemaLiteral, ValidationField } from '../../types.js'

/**
 * Exposes the API to compile the array node to a set of inline
 * Javascript instructions.
 */
export class ArrayCompiler {
  constructor(
    private field: ValidationField,
    private node: SchemaArray,
    private compiler: Compiler,
    private references: {
      outVariable: string
      referenceVariable: string
      parentPointer: ValidationField[]
    }
  ) {}

  /**
   * Declaring the out variable as an empty array. As the validations
   * will progress, this object will receive new properties
   */
  private declareOutVariable(
    buffer: CompilerBuffer,
    outVariable: string,
    outValue: string,
    constAssigment: boolean
  ) {
    const referenceExpression = this.compiler.pointerToExpression(this.field)

    if (constAssigment) {
      buffer.writeExpression(
        `const ${outVariable} = ${this.references.outVariable}[${referenceExpression}] = ${outValue}`
      )
    } else {
      buffer.writeExpression(`${this.references.outVariable}[${referenceExpression}] = ${outValue}`)
    }
  }

  /**
   * Add the if statement to ensure that the runtime value is an
   * array, before we attempt to validate it's members
   */
  private startIfGuard(buffer: CompilerBuffer, variableName: string) {
    buffer.writeStatement(
      `if (${this.compiler.getVariableExistsName(
        variableName
      )} && Array.isArray(${variableName})) {`
    )
    buffer.indent()
  }

  /**
   * Ends the previously started if guard
   */
  private endIfGuard(buffer: CompilerBuffer) {
    buffer.dedent()
    buffer.writeStatement('}')
  }

  /**
   * Start the for loop to loop over the array entries. We use a `for of`
   * loop, since their are one or more children async rules
   */
  private startAsyncForLoop(buffer: CompilerBuffer, variableName: string, indexVariable: string) {
    buffer.writeStatement(`for (let [${indexVariable}] of ${variableName}.entries()) {`)
    buffer.indent()
  }

  /**
   * Start the for loop to loop over the array entries.
   */
  private startForLoop(buffer: CompilerBuffer, variableName: string, indexVariable: string) {
    buffer.writeStatement(
      `for (let ${indexVariable} = 0; ${indexVariable} < ${variableName}.length; ${indexVariable}++) {`
    )
    buffer.indent()
  }

  /**
   * Ends the previously started for loop
   */
  private endForLoop(buffer: CompilerBuffer) {
    buffer.dedent()
    buffer.writeStatement('}')
  }

  /**
   * Returns a boolean telling if any of the children of a given node
   * has async rules. This helps in optimizing the for loop for
   * the array.
   */
  private hasAsyncChildren(node: SchemaArray | SchemaLiteral | SchemaObject): boolean {
    if (node.rules.find((rule) => rule.async)) {
      return true
    }

    if (node.type === 'array' && node.each) {
      return this.hasAsyncChildren(node.each)
    }

    if (node.type === 'object' && node.children) {
      const children = Object.keys(node.children)
      for (let child of children) {
        if (this.hasAsyncChildren(node.children[child])) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Converts the array node to compiled Javascript statement.
   */
  compile(buffer: CompilerBuffer) {
    if (!this.node.rules.length && !this.node.each) {
      return
    }

    /**
     * Parsing the object as a literal node with `array` subtype.
     */
    const literal = new LiteralCompiler(
      this.field,
      {
        type: 'literal' as const,
        subtype: 'array',
        nullable: this.node.nullable,
        optional: this.node.optional,
        rules: this.node.rules,
      },
      this.compiler,
      this.references
    )

    /**
     * Disable output variable since we start with an empty array and
     * only collect the validated properties.
     */
    literal.disableOutVariable = true

    /**
     * Always declare the value variable so that we can reference it to validate
     * the children of the array.
     */
    literal.forceValueDeclaration = true
    literal.compile(buffer)

    const outVariable = `out_${this.compiler.outVariableCounter++}`

    /**
     * Do not output the compiled code for validating children, when no children
     * have been defined on the array
     */
    if (!this.node.each) {
      buffer.writeStatement(
        `if (${this.compiler.getVariableExistsName(literal.variableName)}${
          this.node.nullable ? ` || ${literal.variableName} === null` : ''
        }) {`
      )
      buffer.indent()
      this.declareOutVariable(buffer, outVariable, literal.variableName, false)
      buffer.dedent()
      buffer.writeStatement('}')
      return
    }

    const hasAsyncChildren = this.hasAsyncChildren(this.node.each)

    buffer.newLine()

    /**
     * Add a guard if statement to only validate children when the field
     * value is a valid array
     */
    this.startIfGuard(buffer, literal.variableName)

    const indexVariable = `index_${this.compiler.arrayIndexVariableCounter++}`

    /**
     * Declaring the out variable as an empty array
     */
    this.declareOutVariable(buffer, outVariable, '[]', true)

    /**
     * Add the for loop
     */
    if (hasAsyncChildren) {
      this.startAsyncForLoop(buffer, literal.variableName, indexVariable)
    } else {
      this.startForLoop(buffer, literal.variableName, indexVariable)
    }

    /**
     * Parse members
     */
    buffer.newLine()
    this.compiler.compileNode(
      { name: indexVariable, type: 'identifier' },
      this.node.each,
      buffer,
      this.references.parentPointer.concat(this.field),
      literal.variableName,
      outVariable
    )

    /**
     * End for loop and if guard
     */
    this.endForLoop(buffer)
    this.endIfGuard(buffer)

    /**
     * Entertain null values
     */
    if (this.node.nullable) {
      buffer.writeStatement(`else if (${literal.variableName} === null) {`)
      buffer.indent()
      this.declareOutVariable(buffer, outVariable, 'null', false)
      buffer.dedent()
      buffer.writeStatement(`}`)
    }
  }
}

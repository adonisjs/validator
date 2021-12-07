/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValidationField, SchemaObject } from '@ioc:Adonis/Core/Validator'

import { Compiler } from '../index'
import { CompilerBuffer } from '../Buffer'
import { LiteralCompiler } from './Literal'

/**
 * Exposes the API to compile the object node to a set of inline
 * Javascript instructions.
 */
export class ObjectCompiler {
  constructor(
    private field: ValidationField,
    private node: SchemaObject,
    private compiler: Compiler,
    private references: {
      outVariable: string
      referenceVariable: string
      parentPointer: ValidationField[]
    }
  ) {}

  /**
   * Declaring the out variable as an empty object. As the validations
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
   * Adds a guard that ensures that the runtime value of the field
   * is a valid object, before we attempt to validate it's
   * children.
   */
  private startIfGuard(buffer: CompilerBuffer, variableName: string) {
    buffer.writeStatement(
      `if (${this.compiler.getVariableExistsName(variableName)} && ${
        this.compiler.COMPILER_REFERENCES.isObject
      }(${variableName})) {`
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
   * Converts the object node to compiled Javascript statement.
   */
  public compile(buffer: CompilerBuffer) {
    const children = this.node.children ? Object.keys(this.node.children) : null

    /**
     * Parsing the object as a literal node with `object` subtype.
     */
    const literal = new LiteralCompiler(
      this.field,
      {
        type: 'literal' as const,
        subtype: 'object',
        nullable: this.node.nullable,
        optional: this.node.optional,
        rules: this.node.rules,
      },
      this.compiler,
      this.references
    )

    /**
     * Disable the output variable assignment. Since we do not copy the original
     * object as it is and instead create a fresh object and only set
     * validated fields on it
     */
    literal.disableOutVariable = true
    literal.forceValueDeclaration = true
    literal.compile(buffer)
    const outVariable = `out_${this.compiler.outVariableCounter++}`

    /**
     * Set output variable right away when no children are defined
     * or any children are accepted. There is no need to build
     * the object gradually.
     */
    if (!children || children.length === 0) {
      buffer.writeStatement(
        `if (${this.compiler.getVariableExistsName(literal.variableName)}${
          this.node.nullable ? ` || ${literal.variableName} === null` : ''
        }) {`
      )
      buffer.indent()
      this.declareOutVariable(buffer, outVariable, children ? '{}' : literal.variableName, false)
      buffer.dedent()
      buffer.writeStatement('}')
      return
    }

    /**
     * The object members validation is wrapped inside the if guard
     */
    buffer.newLine()
    this.startIfGuard(buffer, literal.variableName)
    this.declareOutVariable(buffer, outVariable, '{}', true)
    buffer.newLine()

    /**
     * Recursively parse children of the object
     */
    this.compiler.compileTree(
      this.node.children || {},
      buffer,
      this.references.parentPointer.concat(this.field),
      literal.variableName,
      outVariable
    )

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

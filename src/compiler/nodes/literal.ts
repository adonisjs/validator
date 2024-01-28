/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Compiler } from '../index.js'
import { CompilerBuffer } from '../buffer/index.js'
import type { ValidationField, SchemaLiteral } from '../../types.js'

/**
 * Exposes the API to compile the literal node to a set of inline
 * Javascript instructions.
 */
export class LiteralCompiler {
  disableOutVariable: boolean = false
  forceValueDeclaration: boolean = false

  /**
   * Name of the variable set for the literal node
   */
  declare variableName: string

  constructor(
    private field: ValidationField,
    private node: SchemaLiteral,
    private compiler: Compiler,
    private references: {
      outVariable: string
      referenceVariable: string
      parentPointer: ValidationField[]
    }
  ) {}

  /**
   * Initiate the variable name that hold the value of the current
   * field
   */
  private initiateVariableName() {
    this.variableName = this.variableName || `val_${this.compiler.referenceVariableCounter++}`
  }

  /**
   * Writes the compiled statement to declare the value variable
   */
  private declareValueVariable(buffer: CompilerBuffer): void {
    const referenceExpression = this.compiler.pointerToExpression(this.field)
    buffer.writeComment(`Validate ${this.references.referenceVariable}[${referenceExpression}]`)
    buffer.writeExpression(
      `let ${this.variableName} = ${this.references.referenceVariable}[${referenceExpression}]`
    )
  }

  private declareExistsVariable(buffer: CompilerBuffer): void {
    buffer.writeExpression(this.compiler.getVariableExistsDeclaration(this.variableName), true)
  }

  /**
   * Writes the compiled statement for the mutation function. The mutate function is
   * passed to the validation definition.
   */
  private declareMutationFunction(buffer: CompilerBuffer): void {
    buffer.writeStatement(
      this.compiler.getMutationFnDeclararationExpression(this.variableName),
      true
    )
  }

  /**
   * Writes the compiled statement to declare the options that are passed to all
   * the validation functions for this field.
   */
  private declareValidationOptions(buffer: CompilerBuffer) {
    const pointerExpressions = this.references.parentPointer.concat(this.field)
    const pointerExpression = this.compiler.pointersToExpression(pointerExpressions)

    let ar: string | undefined

    const hasDynamicPointers = pointerExpressions.find(({ type }) => type === 'identifier')
    if (hasDynamicPointers) {
      ar = this.compiler.pointersToExpression(
        pointerExpressions.map(({ name, type }) => {
          return type === 'identifier' ? { name: '*', type: 'literal' } : { name, type }
        })
      )
    }

    buffer.writeExpression(
      this.compiler.getOptionsDeclarationExpression(
        this.variableName,
        this.compiler.pointerToExpression(this.field),
        this.references.referenceVariable,
        pointerExpression,
        ar
      ),
      true
    )
  }

  /**
   * Writes the compiled statement to assign the out value.
   */
  private assignOutValue(buffer: CompilerBuffer) {
    const referenceVariable = this.compiler.pointerToExpression(this.field)
    buffer.writeStatement(
      `if (${this.compiler.getVariableExistsName(this.variableName)}${
        this.node.nullable ? ` || ${this.variableName} === null` : ''
      }) {`
    )
    buffer.indent()
    buffer.writeExpression(
      `${this.references.outVariable}[${referenceVariable}] = ${this.variableName}`
    )
    buffer.dedent()
    buffer.writeStatement('}')
  }

  /**
   * Converts the literal node to compiled Javascript statement.
   */
  compile(buffer: CompilerBuffer) {
    /**
     * Return early when no validation rules are defined on the node. However, we check
     * for `forceValueDeclaration` flag to see if we should declare the value
     * variable or not
     */
    if (!this.node.rules.length) {
      if (this.forceValueDeclaration) {
        this.initiateVariableName()
        this.declareValueVariable(buffer)
        this.declareExistsVariable(buffer)
      }
      return
    }

    /**
     * Define variable name
     */
    this.initiateVariableName()
    this.declareValueVariable(buffer)

    /**
     * Define variable to know if value is undefined or null
     */
    this.declareExistsVariable(buffer)

    /**
     * Define mutation function
     */
    this.declareMutationFunction(buffer)

    /**
     * Define options
     */
    this.declareValidationOptions(buffer)

    /**
     * Write expressions for each validation call for the defined
     * rules
     */
    this.node.rules.forEach((rule) => {
      buffer.writeExpression(this.compiler.getValidationCallableExpression(this.variableName, rule))
    })

    /**
     * Do not define the out variable when disabled
     */
    if (!this.disableOutVariable) {
      this.assignOutValue(buffer)
    }
  }
}

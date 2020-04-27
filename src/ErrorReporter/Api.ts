/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { ErrorReporterContract } from '@ioc:Adonis/Core/Validator'
import { ValidationException } from '../ValidationException'

type ApiErrorNode = {
  message: string,
  field: string,
  rule: string,
  args?: any,
}

/**
 * The API Error reporter formats messages as an array of objects
 */
export class ApiErrorReporter implements ErrorReporterContract<{
  errors: ApiErrorNode[]
}> {
  private errors: { field: string, rule: string, message: string, args?: any }[] = []

  /**
   * A boolean to know if an error has been reported or
   * not
   */
  public hasErrors = false

  constructor (private messages: { [key: string]: string }, private bail: boolean) {
  }

  /**
   * Report a new error
   */
  public report (
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    this.hasErrors = true

    /**
     * Finding the best possible error message for the
     * given field and rule.
     *
     * 1. Look for `field.rule`
     * 2. Look for `arrayExpression.rule`
     * 3. Look for just rule
     * 4. Fallback to default reported error message
     */
    let validationMessage = this.messages[`${pointer}.${rule}`]
    if (!validationMessage && arrayExpressionPointer) {
      validationMessage = this.messages[`${arrayExpressionPointer}.${rule}`]
    }
    if (!validationMessage) {
      validationMessage = this.messages[rule] || message
    }

    this.errors.push({
      rule,
      field: pointer,
      message: validationMessage,
      ...(args ? { args } : {}),
    })

    /**
     * Raise exception right away when `bail=true`.
     */
    if (this.bail) {
      throw this.toError()
    }
  }

  public toError () {
    return new ValidationException(false, this.toJSON())
  }

  /**
   * Return errors
   */
  public toJSON () {
    return {
      errors: this.errors,
    }
  }
}

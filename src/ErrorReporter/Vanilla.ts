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

/**
 * The vanilla error reporter to stores an array of messages in
 * reference to a given field. Tailored for displaying messages
 * next to a form field.
 */
export class VanillaErrorReporter implements ErrorReporterContract<
{ [field: string]: string[] }
> {
  /**
   * Collected errors
   */
  private errors: { [field: string]: string[] } = {}

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

    this.errors[pointer] = this.errors[pointer] || []
    this.errors[pointer].push(validationMessage)

    /**
     * Raise exception right away when `bail=true`.
     */
    if (this.bail) {
      throw this.toError()
    }
  }

  /**
   * Returns an instance of [[ValidationException]]
   */
  public toError () {
    return new ValidationException(true, this.toJSON())
  }

  /**
   * Return errors
   */
  public toJSON () {
    return this.errors
  }
}

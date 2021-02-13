/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  VanillaErrorNode,
  MessagesBagContract,
  ErrorReporterContract,
} from '@ioc:Adonis/Core/Validator'
import { ValidationException } from '../ValidationException'

/**
 * The vanilla error reporter to stores an array of messages in
 * reference to a given field. Tailored for displaying messages
 * next to a form field.
 */
export class VanillaErrorReporter implements ErrorReporterContract<VanillaErrorNode> {
  /**
   * Collected errors
   */
  private errors: VanillaErrorNode = {}

  /**
   * A boolean to know if an error has been reported or
   * not
   */
  public hasErrors = false

  constructor(private messages: MessagesBagContract, private bail: boolean) {}

  /**
   * Report a new error
   */
  public report(
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    this.hasErrors = true

    this.errors[pointer] = this.errors[pointer] || []
    this.errors[pointer].push(
      this.messages.get(pointer, rule, message, arrayExpressionPointer, args)
    )

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
  public toError() {
    return new ValidationException(true, this.toJSON())
  }

  /**
   * Return errors
   */
  public toJSON() {
    return this.errors
  }
}

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

type JsonApiErrorNode = {
  source: {
    pointer: string,
  }
  code: string,
  title: string,
  meta?: any,
}

/**
 * The JsonApiErrorReporter formats error messages as per the JSON API spec.
 */
export class JsonApiErrorReporter implements ErrorReporterContract<{ errors: JsonApiErrorNode[] }> {
  private errors: JsonApiErrorNode[] = []

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
    meta?: any
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
      code: rule,
      source: {
        pointer,
      },
      title: validationMessage,
      ...(meta ? { meta } : {}),
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

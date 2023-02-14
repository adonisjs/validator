/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import string from '@poppinss/utils/string'
import { MessagesBagContract, CustomMessages } from '../types.js'

/**
 * Message bag exposes the API to pull the most appropriate message for a
 * given validation failure.
 */
export class MessagesBag implements MessagesBagContract {
  private wildCardCallback: CustomMessages['*']
  constructor(private messages: CustomMessages) {
    this.wildCardCallback =
      typeof this.messages['*'] === 'function' ? this.messages['*'] : undefined
  }

  /**
   * Transform message by replace placeholders with runtime values
   */
  private transform(message: string, rule: string, pointer: string, args?: any) {
    /**
     * No interpolation required
     */
    if (!message.includes('{{')) {
      return message
    }

    return string.interpolate(message, { rule, field: pointer, options: args || {} })
  }

  /**
   * Returns the most appropriate message for the validation failure.
   */
  get(pointer: string, rule: string, message: string, arrayExpressionPointer?: string, args?: any) {
    let validationMessage = this.messages[`${pointer}.${rule}`]

    /**
     * Fetch message for the array expression pointer if it exists
     */
    if (!validationMessage && arrayExpressionPointer) {
      validationMessage = this.messages[`${arrayExpressionPointer}.${rule}`]
    }

    /**
     * Fallback to the message for the rule
     */
    if (!validationMessage) {
      validationMessage = this.messages[rule]
    }

    /**
     * Transform and return message. The wildcard callback is invoked when custom message
     * is not defined
     */
    return validationMessage
      ? this.transform(validationMessage as string, rule, pointer, args)
      : this.wildCardCallback
      ? this.wildCardCallback(pointer, rule, arrayExpressionPointer, args)
      : message
  }
}

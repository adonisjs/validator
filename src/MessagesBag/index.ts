/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { interpolate } from '@poppinss/utils/build/helpers'
import { MessagesBagContract, CustomMessages } from '@ioc:Adonis/Core/Validator'

/**
 * Message bag exposes the API to pull the most appropriate message for a
 * given validation failure.
 */
export class MessagesBag implements MessagesBagContract {
	private wildCardCallback =
		typeof this.messages['*'] === 'function' ? this.messages['*'] : undefined

	constructor(private messages: CustomMessages) {}

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

		return interpolate(message, { rule, field: pointer, options: args || {} })
	}

	/**
	 * Returns the most appropriate message for the validation failure.
	 */
	public get(
		pointer: string,
		rule: string,
		message: string,
		arrayExpressionPointer?: string,
		args?: any
	) {
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
			? this.transform(validationMessage, rule, pointer, args)
			: this.wildCardCallback
			? this.wildCardCallback(pointer, rule, arrayExpressionPointer, args)
			: message
	}
}

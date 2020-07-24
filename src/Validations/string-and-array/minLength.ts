/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation, NodeSubType } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'minLength'
const DEFAULT_MESSAGE = 'minLength validation failed'

/**
 * Ensure the length of an array of a string is above the
 * defined length
 */
export const minLength: SyncValidation<{ minLength: number; subtype: NodeSubType }> = {
	compile: wrapCompile(RULE_NAME, ['string', 'array'], ([limit], _, subtype) => {
		if (typeof limit !== 'number') {
			throw new Error(`The limit value for "${RULE_NAME}" must be defined as a number`)
		}

		return {
			compiledOptions: {
				minLength: limit,
				subtype: subtype,
			},
		}
	}),
	validate(value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
		if (compiledOptions.subtype === 'array' && !Array.isArray(value)) {
			return
		} else if (compiledOptions.subtype === 'string' && typeof value !== 'string') {
			return
		}

		if (value.length < compiledOptions.minLength) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
				minLength: compiledOptions.minLength,
			})
		}
	},
}

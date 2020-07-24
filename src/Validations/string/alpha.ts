/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'alpha'
const DEFAULT_MESSAGE = 'alpha validation failed'

/**
 * Validation signature for the "alpha" regex. Non-string values are
 * ignored.
 */
export const alpha: SyncValidation<{ pattern: string }> = {
	compile: wrapCompile(RULE_NAME, ['string'], ([options]) => {
		let charactersMatch = 'a-zA-Z'

		/**
		 * Allow only alpha characters
		 */
		if (!options || !options.allow || !Array.isArray(options.allow)) {
			return {
				compiledOptions: {
					pattern: `^[${charactersMatch}]+$`,
				},
			}
		}

		/**
		 * Allow spaces
		 */
		if (options.allow.includes('space')) {
			charactersMatch += '\\s'
		}

		/**
		 * Allow dash charcater
		 */
		if (options.allow.includes('dash')) {
			charactersMatch += '-'
		}

		/**
		 * Allow underscores
		 */
		if (options.allow.includes('underscore')) {
			charactersMatch += '_'
		}

		return {
			compiledOptions: {
				pattern: `^[${charactersMatch}]+$`,
			},
		}
	}),
	validate(value, { pattern }, { errorReporter, arrayExpressionPointer, pointer }) {
		/**
		 * Ignore non-string values. The user must apply string rule
		 * to validate string
		 */
		if (typeof value !== 'string') {
			return
		}

		if (!new RegExp(pattern).test(value)) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
		}
	},
}

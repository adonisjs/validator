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

const RULE_NAME = 'equalTo'
const DEFAULT_MESSAGE = 'equalTo validation failed'

/**
 * Validation signature for the "equalTo". Non-string values are
 * ignored.
 */
export const equalTo: SyncValidation<{ fieldValue: string }> = {
	compile: wrapCompile(RULE_NAME, ['string'], ([equalToValue]) => {
		if (!equalToValue || typeof equalToValue !== 'string') {
			throw new Error(`The "${RULE_NAME}" rule expects equalToValue to be a string`)
		}

		return {
			compiledOptions: { fieldValue: equalToValue },
		}
	}),
	validate(value, { fieldValue }, { errorReporter, arrayExpressionPointer, pointer }) {
		/**
		 * Ignore non-string values. The user must apply string rule
		 * to validate string
		 */
		if (typeof value !== 'string') {
			return
		}

		if (value !== fieldValue) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
		}
	},
}

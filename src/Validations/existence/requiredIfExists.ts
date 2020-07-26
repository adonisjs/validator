/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { exists, getFieldValue, wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'requiredIfExists'
const DEFAULT_MESSAGE = 'requiredIfExists validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const requiredIfExists: SyncValidation<{ field: string }> = {
	compile: wrapCompile(RULE_NAME, [], ([field]) => {
		if (!field) {
			throw new Error(`"${RULE_NAME}": expects a "field"`)
		}

		return {
			allowUndefineds: true,
			compiledOptions: {
				field,
			},
		}
	}),
	validate(value, compiledOptions, { root, tip, errorReporter, pointer, arrayExpressionPointer }) {
		const otherFieldExists = exists(getFieldValue(compiledOptions.field, root, tip))
		if (otherFieldExists && !exists(value)) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
				otherField: compiledOptions.field,
			})
		}
	},
}

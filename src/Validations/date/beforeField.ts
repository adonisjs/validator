/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { getFieldValue, wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'beforeField'
const DEFAULT_MESSAGE = 'before date validation failed'

/**
 * Ensure the date is before the defined field.
 */
export const beforeField: SyncValidation<{ field: string }> = {
	compile: wrapCompile(RULE_NAME, [], ([field]) => {
		if (!field) {
			throw new Error(`${RULE_NAME}: expects a "field"`)
		}

		return {
			allowUndefineds: true,
			compiledOptions: {
				field,
			},
		}
	}),
	validate(value, compiledOptions, { root, tip, errorReporter, pointer, arrayExpressionPointer }) {
		const otherFieldValue = getFieldValue(compiledOptions.field, root, tip)
		if (value instanceof DateTime === false || otherFieldValue instanceof DateTime === false) {
			return
		}

		if (value >= otherFieldValue) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
				otherField: compiledOptions.field,
			})
		}
	},
}

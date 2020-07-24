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

import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'date'
const DEFAULT_MESSAGE = 'date validation failed'
const CANNOT_BE_VALIDATED = 'cannot validate data instance against a date format'

/**
 * A list of pre-defined formats and their luxon specific methods
 */
const PREDEFINED_FORMATS = {
	rfc2822: 'fromRFC2822',
	http: 'fromHTTP',
	sql: 'fromSQL',
	iso: 'fromISO',
}

/**
 * Ensure the value is a valid date instance
 */
export const date: SyncValidation<{ format?: string }> = {
	compile: wrapCompile(RULE_NAME, [], ([options]) => {
		return {
			compiledOptions: { format: options && options.format },
		}
	}),
	validate(value, compiledOptions, { mutate, errorReporter, pointer, arrayExpressionPointer }) {
		let dateTime: DateTime | undefined

		const { format } = compiledOptions
		const isDateInstance = value instanceof Date === true

		/**
		 * If value is a valid datetime instance and format is defined, then
		 * report an error and return early. Format is not allowed with
		 * date instances
		 */
		if (isDateInstance && format) {
			errorReporter.report(pointer, RULE_NAME, CANNOT_BE_VALIDATED, arrayExpressionPointer)
			return
		}

		/**
		 * If value is a date instance or a string, then convert it to an instance
		 * of luxon.DateTime.
		 */
		if (isDateInstance) {
			dateTime = DateTime.fromJSDate(value)
		} else if (typeof value === 'string') {
			const formatterFn = PREDEFINED_FORMATS[format || 'iso']
			dateTime = formatterFn ? DateTime[formatterFn](value) : DateTime.fromFormat(value, format!)
		}

		/**
		 * If `dateTime` is still undefined, it means it is not an instance of
		 * date or a string and we must report the error and return early.
		 */
		if (!dateTime) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
			return
		}

		/**
		 * Report error for invalid dates
		 */
		if (!dateTime.isValid) {
			errorReporter.report(
				pointer,
				`${RULE_NAME}.format`,
				dateTime.invalidExplanation!,
				arrayExpressionPointer
			)
			return
		}

		/**
		 * Mutate original value to datetime
		 */
		mutate(dateTime)
	},
}

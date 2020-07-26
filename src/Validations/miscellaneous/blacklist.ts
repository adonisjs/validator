/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import { SyncValidation, NodeSubType } from '@ioc:Adonis/Core/Validator'
import { wrapCompile, enforceArray, isRef } from '../../Validator/helpers'

const RULE_NAME = 'blacklist'
const DEFAULT_MESSAGE = 'blacklist validation failed'

const VERIFIERS = {
	string(value: any, keywords: (string | number)[]) {
		if (typeof value !== 'string') {
			return true
		}
		return !keywords.includes(value)
	},
	number(value: any, keywords: (string | number)[]) {
		if (typeof value !== 'number') {
			return true
		}
		return !keywords.includes(value)
	},
	array(value: any, keywords: (string | number)[]) {
		if (!Array.isArray(value)) {
			return true
		}
		return !value.find((one) => keywords.includes(one))
	},
	date(value: DateTime, keywords: (string | number)[]) {
		if (value instanceof DateTime === false) {
			return true
		}

		const isoDate = value.toISODate()
		if (!isoDate) {
			return true
		}

		return !keywords.includes(isoDate)
	},
}

/**
 * Return type of the compile function
 */
type CompileReturnType = { keywords?: (string | number)[]; ref?: string; subtype: NodeSubType }

/**
 * Ensure the value is one of the defined choices
 */
export const blacklist: SyncValidation<CompileReturnType> = {
	compile: wrapCompile<CompileReturnType>(
		RULE_NAME,
		['string', 'number', 'array', 'date'],
		([keywords], _, subtype) => {
			/**
			 * Choices are defined as a ref
			 */
			if (isRef(keywords)) {
				return {
					compiledOptions: { ref: keywords.key, subtype },
				}
			}

			/**
			 * Ensure value is an array or a ref
			 */
			if (!keywords || !Array.isArray(keywords)) {
				throw new Error(`"${RULE_NAME}": expects an array of "blacklist keywords" or a "ref"`)
			}

			return { compiledOptions: { keywords, subtype } }
		}
	),
	validate(value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer, refs }) {
		let keywords: (string | number)[] = []

		/**
		 * Resolve keywords from the ref or use as it is, if defined as an array
		 */
		if (compiledOptions.ref) {
			const runtimeKeywords = refs[compiledOptions.ref].value
			enforceArray(
				runtimeKeywords,
				`"${RULE_NAME}": expects "refs.${compiledOptions.ref}" to be an array`
			)
			keywords = runtimeKeywords
		} else if (compiledOptions.keywords) {
			keywords = compiledOptions.keywords
		}

		/**
		 * Validation
		 */
		if (!VERIFIERS[compiledOptions.subtype](value, keywords)) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
				keywords,
			})
		}
	},
}

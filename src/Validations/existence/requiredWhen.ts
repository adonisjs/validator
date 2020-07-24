/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { exists, getFieldValue, wrapCompile, isRef } from '../../Validator/helpers'

const RULE_NAME = 'requiredWhen'
const DEFAULT_MESSAGE = 'requiredWhen validation failed'

/**
 * Return value of the compile function
 */
type CompileReturnType = {
	operator: keyof typeof OPERATORS
	field: string
	comparisonValues?: any | any[]
	ref?: string
}

/**
 * Available operators
 */
const OPERATORS = {
	/**
	 * Handles the "in" operator. Also ensures, the comparison values are an
	 * array or a ref.
	 */
	'in': {
		compile(comparisonValues: any) {
			if (!Array.isArray(comparisonValues)) {
				throw new Error(`${RULE_NAME}: "in" operator expects an array of "comparisonValues"`)
			}
		},

		passes: (value: any, comparisonValues: any[]) => {
			return comparisonValues.includes(value)
		},
	},

	/**
	 * Handles the "notIn" operator. Also ensures, the comparison values are an
	 * array or a ref.
	 */
	'notIn': {
		compile(comparisonValues: any[]) {
			if (!Array.isArray(comparisonValues)) {
				throw new Error(`${RULE_NAME}: "notIn" operator expects an array of "comparisonValues"`)
			}
		},

		passes: (value: any, comparisonValues: any[]) => {
			return !comparisonValues.includes(value)
		},
	},

	/**
	 * Handles the "=" operator. No compile time checks are required here
	 */
	'=': {
		passes: (value: any, comparisonValue: any) => {
			return value === comparisonValue
		},
	},

	/**
	 * Handles the "!=" operator. No compile time checks are required here
	 */
	'!=': {
		passes: (value: any, comparisonValue: any) => {
			return value !== comparisonValue
		},
	},

	/**
	 * Handles the ">" operator. Ensures `comparisonValue` is a number
	 * or a ref
	 */
	'>': {
		compile(comparisonValue: number) {
			if (typeof comparisonValue !== 'number') {
				throw new Error(`${RULE_NAME}: ">" operator expects "comparisonValue" to be a number`)
			}
		},

		passes: (value: number, comparisonValue: number) => {
			return value > comparisonValue
		},
	},

	/**
	 * Handles the "<" operator. Ensures `comparisonValue` is a number
	 * or a ref
	 */
	'<': {
		compile(comparisonValue: number) {
			if (typeof comparisonValue !== 'number') {
				throw new Error(`${RULE_NAME}: "<" operator expects "comparisonValue" to be a number`)
			}
		},

		passes: (value: number, comparisonValue: number) => {
			return value < comparisonValue
		},
	},

	/**
	 * Handles the ">=" operator. Ensures `comparisonValue` is a number
	 * or a ref
	 */
	'>=': {
		compile(comparisonValue: number) {
			if (typeof comparisonValue !== 'number') {
				throw new Error(`${RULE_NAME}: ">=" operator expects "comparisonValue" to be a number`)
			}
		},

		passes: (value: number, comparisonValue: number) => {
			return value >= comparisonValue
		},
	},

	/**
	 * Handles the "<=" operator. Ensures `comparisonValue` is a number
	 * or a ref
	 */
	'<=': {
		compile(comparisonValue: number) {
			if (typeof comparisonValue !== 'number') {
				throw new Error(`${RULE_NAME}: "<=" operator expects "comparisonValue" to be a number`)
			}
		},

		passes: (value: number, comparisonValue: number) => {
			return value <= comparisonValue
		},
	},
}

/**
 * Ensure the value exists when defined expectation passed.
 * `null`, `undefined` and `empty string` fails the validation.
 */
export const requiredWhen: SyncValidation<CompileReturnType> = {
	compile: wrapCompile<CompileReturnType>(RULE_NAME, [], ([field, operator, comparisonValues]) => {
		/**
		 * Ensure "field", "operator" and "comparisonValues" are defined
		 */
		if (!field || !operator || comparisonValues === undefined) {
			throw new Error(`${RULE_NAME}: expects a "field", "operator" and "comparisonValue"`)
		}

		/**
		 * Ensure "operator" is defined
		 */
		if (!OPERATORS[operator]) {
			throw new Error(`${RULE_NAME}: expects "operator" to be one of the whitelisted operators`)
		}

		/**
		 * Value is a ref
		 */
		if (isRef(comparisonValues)) {
			return {
				allowUndefineds: true,
				compiledOptions: {
					operator,
					field,
					ref: comparisonValues.key,
				},
			}
		}

		/**
		 * Compile the options for a given operator when they
		 * implement a compile function
		 */
		if (typeof OPERATORS[operator].compile === 'function') {
			OPERATORS[operator].compile(comparisonValues)
		}

		return {
			allowUndefineds: true,
			compiledOptions: {
				operator,
				field,
				comparisonValues,
			},
		}
	}),
	validate(
		value,
		compiledOptions,
		{ errorReporter, pointer, arrayExpressionPointer, root, tip, refs }
	) {
		let comparisonValues: any

		/**
		 * Resolve comparisonValues
		 */
		if (compiledOptions.ref) {
			comparisonValues = refs[compiledOptions.ref].value
		} else {
			comparisonValues = compiledOptions.comparisonValues
		}

		/**
		 * Finding if field should be required
		 */
		const shouldBeRequired = OPERATORS[compiledOptions.operator].passes(
			getFieldValue(compiledOptions.field, root, tip),
			comparisonValues
		)

		/**
		 * Validation
		 */
		if (shouldBeRequired && !exists(value)) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
				operator: compiledOptions.operator,
				otherField: compiledOptions.field,
				values: comparisonValues,
			})
		}
	},
}

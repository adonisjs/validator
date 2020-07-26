/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import { ValidationRuntimeOptions } from '@ioc:Adonis/Core/Validator'
import { getFieldValue } from '../../../Validator/helpers'

/**
 * Return type of the compile function
 */
export type CompileReturnType = {
	operator: '>' | '<' | '>=' | '<='
	field: string
}

/**
 * Returns a luxon date time instance based upon the unit, duration and operator
 */
function compareDateTime(
	lhs: DateTime,
	rhs: DateTime,
	operator: CompileReturnType['operator']
): boolean {
	switch (operator) {
		case '>':
			return lhs > rhs
		case '<':
			return lhs < rhs
		case '>=':
			return lhs >= rhs
		case '<=':
			return lhs <= rhs
	}
}

/**
 * Compiles a date field comparison rule
 */
export function compile(
	ruleName: string,
	operator: '>' | '<' | '>=' | '<=',
	[field]: any[]
): { compiledOptions: CompileReturnType } {
	if (!field) {
		throw new Error(`${ruleName}: expects a comparison "field"`)
	}

	return {
		compiledOptions: {
			operator,
			field,
		},
	}
}

/**
 * Validates date field comparison rule
 */
export function validate(
	ruleName: string,
	errorMessage: string,
	value: any,
	{ field, operator }: CompileReturnType,
	{ root, tip, errorReporter, pointer, arrayExpressionPointer }: ValidationRuntimeOptions
) {
	/**
	 * Skip when value is not a date time instance. One must use date schema
	 * type
	 */
	if (value instanceof DateTime === false) {
		return
	}

	const comparisonValue = getFieldValue(field, root, tip)

	/**
	 * Skip when comparison value is not a date time instance. One must use date schema
	 * type and put this field above the current field.
	 */
	if (comparisonValue instanceof DateTime === false) {
		return
	}

	if (!compareDateTime(value, comparisonValue, operator)) {
		errorReporter.report(pointer, ruleName, errorMessage, arrayExpressionPointer, {
			otherField: field,
		})
	}
}

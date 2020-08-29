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
import { isRef, enforceDateTime } from '../../../Validator/helpers'

/**
 * Return type of the compile function
 */
export type CompileReturnType = {
	operator: '>=' | '<='
	ref: string
}

/**
 * Returns a luxon date time instance based upon the unit, duration and operator
 */

/**
 * Returns a luxon date time instance based upon the unit, duration and operator
 */
function compareDateTime(lhs: DateTime, rhs: DateTime, operator: '>=' | '<=') {
	return operator === '>=' ? lhs >= rhs : lhs <= rhs
}

/**
 * Compiles an offset based date rule
 */
export function compile(
	ruleName: string,
	operator: '>=' | '<=',
	[otherValue]: any
): { compiledOptions: CompileReturnType } {
	/**
	 * Choices are defined as a ref
	 */
	if (!isRef(otherValue)) {
		throw new Error(`"${ruleName}": expects value to be a ref of type DateTime`)
	}

	return {
		compiledOptions: { ref: otherValue.key, operator },
	}
}

/**
 * Validates offset based date rules
 */
export function validate(
	ruleName: string,
	errorMessage: string,
	value: any,
	compiledOptions: CompileReturnType,
	{ errorReporter, pointer, arrayExpressionPointer, refs }: ValidationRuntimeOptions
) {
	let comparisonDate: DateTime | unknown

	/**
	 * Do not run validation when original value is not a dateTime instance.
	 */
	if (value instanceof DateTime === false) {
		return
	}

	/**
	 * Resolve datetime to compare against
	 */
	comparisonDate = refs[compiledOptions.ref].value

	if (!comparisonDate) {
		return
	}

	enforceDateTime(
		comparisonDate,
		`"${ruleName}": expects "refs.${compiledOptions.ref}" to be an date`
	)

	if (!compareDateTime(value, comparisonDate, compiledOptions.operator)) {
		errorReporter.report(pointer, ruleName, errorMessage, arrayExpressionPointer, {
			[ruleName]: comparisonDate.toISO(),
		})
	}
}

import test from 'japa'
import { ValidationContract, ParsedRule } from '@ioc:Adonis/Core/Validator'
import { MessagesBag } from '../../../src/MessagesBag'
import { ApiErrorReporter } from '../../../src/ErrorReporter/Api'

type ValidationOptions = {
	root?: any
	tip?: any
	mutate?: () => any
}

/**
 * Ensure rule is reporting errors
 */
function reportErrors(
	validation: ValidationContract<any>,
	testFn: typeof test,
	failureValue: any,
	rule: ParsedRule,
	validationOptions?: ValidationOptions
) {
	testFn('report error with a default message', (assert) => {
		const errorReporter = new ApiErrorReporter(new MessagesBag({}), false)
		validation.validate(
			failureValue,
			rule.compiledOptions,
			Object.assign(
				{
					root: {},
					tip: {},
					field: 'username',
					pointer: 'username',
					errorReporter: errorReporter,
					mutate: () => {},
					refs: {},
				},
				validationOptions
			)
		)

		const errorMessages = errorReporter.toJSON()
		assert.lengthOf(errorMessages.errors, 1)
		assert.equal(errorMessages.errors[0].rule, rule.name)
		assert.equal(errorMessages.errors[0].field, 'username')
		assert.exists(errorMessages.errors[0].message)
	})
}

/**
 * Ensure rule is reporting errors with correct pointer
 */
function reportUserDefinedErrors(
	validation: ValidationContract<any>,
	testFn: typeof test,
	failureValue: any,
	rule: ParsedRule,
	validationOptions?: ValidationOptions
) {
	testFn('report error with field pointer', (assert) => {
		const errorReporter = new ApiErrorReporter(
			new MessagesBag({
				[`username.${rule.name}`]: 'Validation failure for username',
			}),
			false
		)

		validation.validate(
			failureValue,
			rule.compiledOptions,
			Object.assign(
				{
					root: {},
					tip: {},
					field: 'username',
					pointer: 'username',
					errorReporter: errorReporter,
					mutate: () => {},
					refs: {},
				},
				validationOptions
			)
		)

		const errorMessages = errorReporter.toJSON()
		assert.lengthOf(errorMessages.errors, 1)
		assert.equal(errorMessages.errors[0].rule, rule.name)
		assert.equal(errorMessages.errors[0].field, 'username')
		assert.equal(errorMessages.errors[0].message, 'Validation failure for username')
	})
}

/**
 * Ensure rule is sending array expression when defined
 */
function reportUserDefinedErrorsForArrayExpression(
	validation: ValidationContract<any>,
	testFn: typeof test,
	failureValue: any,
	rule: ParsedRule,
	validationOptions?: ValidationOptions
) {
	testFn('report error with array expression pointer', (assert) => {
		const errorReporter = new ApiErrorReporter(
			new MessagesBag({
				[`users.*.username.${rule.name}`]: 'Validation failure for users username',
			}),
			false
		)

		validation.validate(
			failureValue,
			rule.compiledOptions,
			Object.assign(
				{
					root: {},
					tip: {},
					field: 'username',
					pointer: 'users.0.username',
					arrayExpressionPointer: 'users.*.username',
					errorReporter: errorReporter,
					mutate: () => {},
					refs: {},
				},
				validationOptions
			)
		)

		const errorMessages = errorReporter.toJSON()
		assert.lengthOf(errorMessages.errors, 1)
		assert.equal(errorMessages.errors[0].rule, rule.name)
		assert.equal(errorMessages.errors[0].field, 'users.0.username')
		assert.equal(errorMessages.errors[0].message, 'Validation failure for users username')
	})
}

/**
 * Ensure rule is not reporting errors when validation passes
 */
function doNotReportErrorWithSuccessValue(
	validation: ValidationContract<any>,
	testFn: typeof test,
	successValue: any,
	rule: ParsedRule,
	validationOptions?: ValidationOptions
) {
	testFn('do not report error when value is valid', (assert) => {
		const errorReporter = new ApiErrorReporter(new MessagesBag({}), false)
		validation.validate(
			successValue,
			rule.compiledOptions,
			Object.assign(
				{
					root: {},
					tip: {},
					field: 'username',
					pointer: 'users.0.username',
					arrayExpressionPointer: 'users.*.username',
					errorReporter: errorReporter,
					mutate: () => {},
					refs: {},
				},
				validationOptions
			)
		)

		const errorMessages = errorReporter.toJSON()
		assert.lengthOf(errorMessages.errors, 0)
	})
}

/**
 * Validate reporter against expectations
 */
export function validate(
	validation: ValidationContract<any>,
	testFn: typeof test,
	failureValue: any,
	successValue: any,
	rule: ParsedRule,
	validationOptions?: ValidationOptions
) {
	reportErrors(validation, testFn, failureValue, rule, validationOptions)
	reportUserDefinedErrors(validation, testFn, failureValue, rule, validationOptions)
	reportUserDefinedErrorsForArrayExpression(
		validation,
		testFn,
		failureValue,
		rule,
		validationOptions
	)
	doNotReportErrorWithSuccessValue(validation, testFn, successValue, rule, validationOptions)
}

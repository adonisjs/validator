import test from 'japa'
import { ValidationContract } from '@ioc:Adonis/Core/Validator'
import { ApiErrorReporter } from '../../../src/ErrorReporter/Api'

/**
 * Ensure rule is reporting errors
 */
function reportErrors (
  validation: ValidationContract,
  testFn: typeof test,
  failureValue: any,
  compileOptions?: any,
) {
  testFn('report error with a default message', (assert) => {
    compileOptions = Object.assign({ type: 'literal', subtype: 'string' }, compileOptions)
    const rule = validation.compile(compileOptions.type, compileOptions.subtype, compileOptions.options)
    const errorReporter = new ApiErrorReporter({}, false)

    validation.validate(failureValue, rule.compiledOptions, {
      root: {},
      tip: {},
      pointer: 'username',
      errorReporter: errorReporter,
      mutate: () => {},
    })

    const errorMessages = errorReporter.toJSON()
    assert.lengthOf(errorMessages, 1)
    assert.equal(errorMessages[0].rule, rule.name)
    assert.equal(errorMessages[0].field, 'username')
    assert.exists(errorMessages[0].message)
  })
}

/**
 * Ensure rule is reporting errors with correct pointer
 */
function reportUserDefinedErrors (
  validation: ValidationContract,
  testFn: typeof test,
  failureValue: any,
  compileOptions?: any,
) {
  testFn('report error with field pointer', (assert) => {
    compileOptions = Object.assign({ type: 'literal', subtype: 'string' }, compileOptions)
    const rule = validation.compile(compileOptions.type, compileOptions.subtype, compileOptions.options)

    const errorReporter = new ApiErrorReporter({
      [`username.${rule.name}`]: 'Validation failure for username',
    }, false)

    validation.validate(failureValue, rule.compiledOptions, {
      root: {},
      tip: {},
      pointer: 'username',
      errorReporter: errorReporter,
      mutate: () => {},
    })

    const errorMessages = errorReporter.toJSON()
    assert.lengthOf(errorMessages, 1)
    assert.equal(errorMessages[0].rule, rule.name)
    assert.equal(errorMessages[0].field, 'username')
    assert.equal(errorMessages[0].message, 'Validation failure for username')
  })
}

/**
 * Ensure rule is sending array expression when defined
 */
function reportUserDefinedErrorsForArrayExpression (
  validation: ValidationContract,
  testFn: typeof test,
  failureValue: any,
  compileOptions?: any,
) {
  testFn('report error with array expression pointer', (assert) => {
    compileOptions = Object.assign({ type: 'literal', subtype: 'string' }, compileOptions)
    const rule = validation.compile(compileOptions.type, compileOptions.subtype, compileOptions.options)

    const errorReporter = new ApiErrorReporter({
      [`users.*.username.${rule.name}`]: 'Validation failure for users username',
    }, false)

    validation.validate(failureValue, rule.compiledOptions, {
      root: {},
      tip: {},
      pointer: 'users.0.username',
      arrayExpressionPointer: 'users.*.username',
      errorReporter: errorReporter,
      mutate: () => {},
    })

    const errorMessages = errorReporter.toJSON()
    assert.lengthOf(errorMessages, 1)
    assert.equal(errorMessages[0].rule, rule.name)
    assert.equal(errorMessages[0].field, 'users.0.username')
    assert.equal(errorMessages[0].message, 'Validation failure for users username')
  })
}

/**
 * Ensure rule is not reporting errors when validation passes
 */
function doNotReportErrorWithSuccessValue (
  validation: ValidationContract,
  testFn: typeof test,
  successValue: any,
  compileOptions?: any,
) {
  testFn('do not report error when value is valid', (assert) => {
    compileOptions = Object.assign({ type: 'literal', subtype: 'string' }, compileOptions)
    const rule = validation.compile(compileOptions.type, compileOptions.subtype, compileOptions.options)

    const errorReporter = new ApiErrorReporter({}, false)
    validation.validate(successValue, rule.compiledOptions, {
      root: {},
      tip: {},
      pointer: 'users.0.username',
      arrayExpressionPointer: 'users.*.username',
      errorReporter: errorReporter,
      mutate: () => {},
    })

    const errorMessages = errorReporter.toJSON()
    assert.lengthOf(errorMessages, 0)
  })
}

/**
 * Validate reporter against expectations
 */
export function validate (
  validation: ValidationContract,
  testFn: typeof test,
  failureValue: any,
  successValue: any,
  compileOptions?: {
    type?: string,
    subtype?: string,
    options?: any,
  }
) {
  reportErrors(validation, testFn, failureValue, compileOptions)
  reportUserDefinedErrors(validation, testFn, failureValue, compileOptions)
  reportUserDefinedErrorsForArrayExpression(validation, testFn, failureValue, compileOptions)
  doNotReportErrorWithSuccessValue(validation, testFn, successValue, compileOptions)
}

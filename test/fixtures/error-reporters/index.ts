import test from 'japa'
import { ErrorReporterConstructorContract } from '@ioc:Adonis/Core/Validator'

/**
 * Ensure errors are collected
 */
function collectsMessages (
  Reporter: ErrorReporterConstructorContract,
  testFn: typeof test,
  getMessage: (messages: any) => { field: string, message: string }[],
) {
  testFn('collect reported errors', (assert) => {
    const errorReporter = new Reporter({}, false)
    errorReporter.report('username', 'required', 'Required validation failed')
    assert.isTrue(errorReporter.hasErrors)
    assert.deepEqual(getMessage(errorReporter.toJSON()), [{
      field: 'username',
      message: 'Required validation failed',
    }])
  })
}

/**
 * Ensure use messages are given the preference
 */
function useUserDefinedMessages (
  Reporter: ErrorReporterConstructorContract,
  testFn: typeof test,
  getMessage: (messages: any) => { field: string, message: string }[],
) {
  testFn('give preference to user defined messages for a field.rule', (assert) => {
    const errorReporter = new Reporter({
      'username.required': 'Username is required',
    }, false)
    errorReporter.report('username', 'required', 'Required validation failed')

    assert.isTrue(errorReporter.hasErrors)
    assert.deepEqual(getMessage(errorReporter.toJSON()), [{
      field: 'username',
      message: 'Username is required',
    }])
  })
}

/**
 * Ensure use messages are given the preference for a rule
 */
function useRuleMessages (
  Reporter: ErrorReporterConstructorContract,
  testFn: typeof test,
  getMessage: (messages: any) => { field: string, message: string }[],
) {
  testFn('give preference to user defined messages for a rule', (assert) => {
    const errorReporter = new Reporter({
      'required': 'The field is required',
    }, false)
    errorReporter.report('username', 'required', 'Required validation failed')
    assert.isTrue(errorReporter.hasErrors)
    assert.deepEqual(getMessage(errorReporter.toJSON()), [{
      field: 'username',
      message: 'The field is required',
    }])
  })
}

/**
 * Ensure that array expressions messages are used
 */
function useArrayExpressionMessage (
  Reporter: ErrorReporterConstructorContract,
  testFn: typeof test,
  getMessage: (messages: any) => { field: string, message: string }[],
) {
  testFn('use array expression message when defined', (assert) => {
    const errorReporter = new Reporter({
      'users.*.username.required': 'Each user must have a username',
    }, false)
    errorReporter.report(
      'users.0.username',
      'required',
      'Required validation failed',
      'users.*.username',
    )

    assert.isTrue(errorReporter.hasErrors)
    assert.deepEqual(getMessage(errorReporter.toJSON()), [{
      field: 'users.0.username',
      message: 'Each user must have a username',
    }])
  })
}

/**
 * Ensure that pointer messages are given preference
 */
function usePointerMessage (
  Reporter: ErrorReporterConstructorContract,
  testFn: typeof test,
  getMessage: (messages: any) => { field: string, message: string }[],
) {
  testFn('given preference to field message, when array expression message is defined', (assert) => {
    const errorReporter = new Reporter({
      'users.*.username.required': 'Each user must have a username',
      'users.0.username.required': 'Primary user must have a username',
    }, false)
    errorReporter.report(
      'users.0.username',
      'required',
      'Required validation failed',
      'users.*.username',
    )

    assert.isTrue(errorReporter.hasErrors)
    assert.deepEqual(getMessage(errorReporter.toJSON()), [{
      field: 'users.0.username',
      message: 'Primary user must have a username',
    }])
  })
}

/**
 * Ensure raises exception when bail=true
 */
function raiseException (
  Reporter: ErrorReporterConstructorContract,
  testFn: typeof test,
  getMessage: (messages: any) => { field: string, message: string }[],
) {
  testFn('raise exception when bail is true', (assert) => {
    assert.plan(2)

    const errorReporter = new Reporter({
      'required': 'The field is required',
    }, true)

    try {
      errorReporter.report('username', 'required', 'Required validation failed')
    } catch (error) {
      assert.isTrue(errorReporter.hasErrors)
      assert.deepEqual(getMessage(errorReporter.toJSON()), [{
        field: 'username',
        message: 'The field is required',
      }])
    }
  })
}

/**
 * Validate reporter against expectations
 */
export function validate (
  Reporter: ErrorReporterConstructorContract,
  testFn: typeof test,
  getMessage: (messages: any) => { field: string, message: string }[],
) {
  collectsMessages(Reporter, testFn, getMessage)
  useUserDefinedMessages(Reporter, testFn, getMessage)
  useRuleMessages(Reporter, testFn, getMessage)
  raiseException(Reporter, testFn, getMessage)
  useArrayExpressionMessage(Reporter, testFn, getMessage)
  usePointerMessage(Reporter, testFn, getMessage)
}

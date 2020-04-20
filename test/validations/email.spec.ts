/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'

import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { email } from '../../src/Validations/string/email'
import { EmailRuleOptions } from '@ioc:Adonis/Core/Validator'

function compile (options?: EmailRuleOptions) {
  return email.compile('literal', 'string', rules.email(options).options)
}

test.group('Email', () => {
  validate(email, test, '9999', 'foo@bar.com', compile())

  test('ignore validation when value is not a valid string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    email.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value fails the email validation', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    email.validate('hello-22', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'email',
      rule: 'email',
      message: 'email validation failed',
    }])
  })

  test('work fine when value passes the email validation', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    email.validate('foo@bar.com', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('sanitize email to lowercase', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let emailValue = 'FOO@bar.com'

    email.validate(emailValue, compile({ sanitize: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      mutate: (newValue) => emailValue = newValue,
    })

    assert.equal(emailValue, 'foo@bar.com')
  })
})

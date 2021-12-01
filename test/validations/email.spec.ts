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
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { email } from '../../src/Validations/string/email'
import { EmailRuleOptions } from '@ioc:Adonis/Core/Validator'

function compile(options?: EmailRuleOptions) {
  return email.compile('literal', 'string', rules.email(options).options, {})
}

test.group('Email', () => {
  validate(email, test, '9999', 'foo@bar.com', compile())

  test('ignore validation when value is not a valid string', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    email.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value fails the email validation', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    email.validate('hello-22', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'email',
          rule: 'email',
          message: 'email validation failed',
        },
      ],
    })
  })

  test('work fine when value passes the email validation', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    email.validate('foo@bar.com', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('sanitize email to lowercase', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let emailValue = 'FOO@bar.com'

    email.validate(emailValue, compile({ sanitize: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'email',
      pointer: 'email',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (emailValue = newValue),
    })

    assert.equal(emailValue, 'foo@bar.com')
  })

  test('sanitize email but keep gmail dots', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let emailValue = 'FOO.bar+2@gmail.com'

    email.validate(
      emailValue,
      compile({
        sanitize: {
          removeDots: false,
        },
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'email',
        pointer: 'email',
        tip: {},
        root: {},
        refs: {},
        mutate: (newValue) => (emailValue = newValue),
      }
    )

    assert.equal(emailValue, 'foo.bar@gmail.com')
  })

  test('sanitize email but keep subaddress', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let emailValue = 'FOO.bar+2@gmail.com'

    email.validate(
      emailValue,
      compile({
        sanitize: {
          removeSubaddress: false,
        },
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'email',
        pointer: 'email',
        tip: {},
        root: {},
        refs: {},
        mutate: (newValue) => (emailValue = newValue),
      }
    )

    assert.equal(emailValue, 'foobar+2@gmail.com')
  })
})

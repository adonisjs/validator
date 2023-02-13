/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { email } from '../../src/validations/string/email.js'
import { EmailValidationOptions } from '../../src/types.js'

function compile(options?: EmailValidationOptions) {
  return email.compile('literal', 'string', rules.email(options).options, {})
}

test.group('Email', () => {
  validate(email, test, '9999', 'foo@bar.com', compile())

  test('ignore validation when value is not a valid string', ({ assert }) => {
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

  test('report error when value fails the email validation', ({ assert }) => {
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

  test('work fine when value passes the email validation', ({ assert }) => {
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
})

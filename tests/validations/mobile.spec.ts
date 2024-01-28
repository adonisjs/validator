/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import validator from 'validator'
import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { mobile } from '../../src/validations/string/mobile.js'

function compile(options?: { strict?: boolean; locale?: validator.MobilePhoneLocale[] }) {
  return mobile.compile('literal', 'string', rules.mobile(options).options, {})
}

test.group('Mobile', () => {
  validate(mobile, test, '9999', '7555244225', compile())

  test('ignore validation when value is not a valid string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    mobile.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'phone_number',
      pointer: 'phone_number',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value fails the mobile validation', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    mobile.validate('hello-22', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'phone_number',
      pointer: 'phone_number',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'phone_number',
          rule: 'mobile',
          message: 'mobile validation failed',
        },
      ],
    })
  })

  test('work fine when value passes the mobile validation', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    mobile.validate('7555244225', compile({ locale: ['en-IN'] }).compiledOptions, {
      errorReporter: reporter,
      field: 'phone_number',
      pointer: 'phone_number',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

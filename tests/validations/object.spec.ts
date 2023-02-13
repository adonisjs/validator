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
import { object } from '../../src/validations/primitives/object.js'

function compile() {
  return object.compile('object', 'object', (rules as any)['object']().options, {})
}

test.group('Object', () => {
  validate(object, test, null, {}, compile())

  test('report error when value is null', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    object.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'profile',
      pointer: 'profile',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'profile',
          rule: 'object',
          message: 'object validation failed',
        },
      ],
    })
  })

  test('report error when value is an array', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    object.validate([], compile().compiledOptions, {
      errorReporter: reporter,
      field: 'profile',
      pointer: 'profile',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'profile',
          rule: 'object',
          message: 'object validation failed',
        },
      ],
    })
  })

  test('work fine when value is a valid object', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    object.validate({}, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'profile',
      pointer: 'profile',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

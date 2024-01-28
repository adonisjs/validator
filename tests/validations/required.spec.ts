/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { required } from '../../src/validations/existence/required.js'

function compile() {
  return required.compile('literal', 'string', rules.required().options, {})
}

test.group('Required', () => {
  validate(required, test, undefined, 'anything', compile())

  test('report error when value is null', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    required.validate(null, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'required',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('report error when value is undefined', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    required.validate(undefined, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'required',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('report error when value is an empty string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    required.validate('', compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'required',
          message: 'required validation failed',
        },
      ],
    })
  })

  test('work fine when value is defined', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    required.validate('virk', compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value is negative boolean', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    required.validate(false, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value is zero', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    required.validate(0, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

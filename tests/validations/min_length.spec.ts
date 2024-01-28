/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { NodeSubType } from '../../src/types.js'

import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { minLength } from '../../src/validations/string_and_array/min_length.js'

function compile(subtype: NodeSubType, length: number) {
  return minLength.compile('literal', subtype, rules.minLength(length).options)
}

test.group('Min Length', () => {
  validate(minLength, test, 'hello', 'helloworld', compile('string', 6), {})

  test('do not compile when args are not defined', ({ assert }) => {
    const fn = () => minLength.compile('literal', 'array')
    assert.throws(fn, '"minLength": The 3rd argument must be a combined array of arguments')
  })

  test('do not compile when length is not defined', ({ assert }) => {
    const fn = () => minLength.compile('literal', 'array', [])
    assert.throws(fn, 'The limit value for "minLength" must be defined as a number')
  })

  test('do not compile node subtype is not array or string', ({ assert }) => {
    const fn = () => minLength.compile('literal', 'object', [])
    assert.throws(fn, '"minLength": Rule can only be used with "schema.<string,array>" type(s)')
  })

  test('compile with options', ({ assert }) => {
    assert.deepEqual(minLength.compile('literal', 'array', [10]), {
      name: 'minLength',
      allowUndefineds: false,
      async: false,
      compiledOptions: { minLength: 10, subtype: 'array' },
    })
  })

  test('skip when value is not an array or string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minLength.validate(
      {},
      { minLength: 10, subtype: 'array' },
      {
        errorReporter: reporter,
        field: 'username',
        pointer: 'username',
        tip: {
          username: {},
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('raise error when string length is under the minLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minLength.validate('hello', compile('string', 10).compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
        username: 'hello',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'minLength',
          args: { minLength: 10 },
          message: 'minLength validation failed',
        },
      ],
    })
  })

  test('raise error when array length is under the minLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minLength.validate(['hello', 'world'], compile('array', 3).compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
        username: ['hello', 'world'],
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'minLength',
          args: { minLength: 3 },
          message: 'minLength validation failed',
        },
      ],
    })
  })

  test('work fine when string length is above or equals minLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minLength.validate('helloworld', compile('string', 10).compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
        username: 'helloworld',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when array length is above or equals minLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minLength.validate(['hello'], compile('array', 1).compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
        username: ['hello'],
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

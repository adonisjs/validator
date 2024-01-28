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
import { maxLength } from '../../src/validations/string_and_array/max_length.js'

function compile(subtype: NodeSubType, length: number) {
  return maxLength.compile('literal', subtype, rules.maxLength(length).options, {})
}

test.group('Max Length', () => {
  validate(maxLength, test, 'helloworld', 'hello', compile('string', 6))

  test('do not compile when args are not defined', ({ assert }) => {
    const fn = () => maxLength.compile('literal', 'array')
    assert.throws(fn, '"maxLength": The 3rd argument must be a combined array of arguments')
  })

  test('do not compile when length is not defined', ({ assert }) => {
    const fn = () => maxLength.compile('literal', 'array', [])
    assert.throws(fn, 'The limit value for "maxLength" must be defined as a number')
  })

  test('do not compile when node subtype is not an array or string', ({ assert }) => {
    const fn = () => maxLength.compile('literal', 'object', [])
    assert.throws(fn, '"maxLength": Rule can only be used with "schema.<string,array>" type(s)')
  })

  test('compile with options', ({ assert }) => {
    assert.deepEqual(maxLength.compile('literal', 'array', [10]), {
      name: 'maxLength',
      allowUndefineds: false,
      async: false,
      compiledOptions: { maxLength: 10, subtype: 'array' },
    })
  })

  test('skip when value is not an array or string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maxLength.validate(
      {},
      { maxLength: 10, subtype: 'string' },
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

  test('raise error when string length is over the maxLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maxLength.validate('hello-world', compile('string', 10).compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
        username: 'hello-world',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'maxLength',
          args: { maxLength: 10 },
          message: 'maxLength validation failed',
        },
      ],
    })
  })

  test('raise error when array length is over the maxLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maxLength.validate(['hello', 'world'], compile('array', 1).compiledOptions!, {
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
          rule: 'maxLength',
          args: { maxLength: 1 },
          message: 'maxLength validation failed',
        },
      ],
    })
  })

  test('work fine when string length is under or equals maxLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maxLength.validate('helloworld', compile('string', 10).compiledOptions!, {
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

  test('work fine when array length is under or equals maxLength', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maxLength.validate(['hello'], compile('array', 1).compiledOptions!, {
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

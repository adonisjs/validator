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
import { range } from '../../src/validations/number/range.js'

function compile(start: number, stop: number) {
  return range.compile('literal', 'number', rules.range(start, stop).options, {})
}

test.group('range', () => {
  validate(range, test, -2, 50, compile(1, 100))

  test('do not compile when start is not a number', ({ assert }) => {
    const fn = () => range.compile('literal', 'number', ['10', 100])
    assert.throws(fn, 'The start value for "range" must be defined as number')
  })

  test('do not compile when stop is not a number', ({ assert }) => {
    const fn = () => range.compile('literal', 'number', [10, '100'])
    assert.throws(fn, 'The stop value for "range" must be defined as number')
  })

  test('do not compile if start value is lower than stop value', ({ assert }) => {
    const fn = () => range.compile('literal', 'number', [100, 10])
    assert.throws(fn, 'The start value for "range" must be lower than the stop value')
  })

  test('report error when value is lower than the range', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    range.validate(0, compile(1, 100).compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'age',
          rule: 'range',
          args: {
            start: 1,
            stop: 100,
          },
          message: 'range validation failed',
        },
      ],
    })
  })

  test('report error when value is higher than the range', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    range.validate(0, compile(1, 100).compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'age',
          rule: 'range',
          args: {
            start: 1,
            stop: 100,
          },
          message: 'range validation failed',
        },
      ],
    })
  })

  test('skip when value is not a number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    range.validate('-10', compile(1, 100).compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value is a valid number in the range', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    range.validate(25, compile(1, 100).compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

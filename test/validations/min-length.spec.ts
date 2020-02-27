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
import { minLength } from '../../src/Validations/string-and-array/minLength'

function compile (length: number) {
  return minLength.compile('literal', 'string', rules.minLength(length).options)
}

test.group('Min Length', () => {
  validate(minLength, test, 'hello', 'helloworld', compile(6))

  test('do not compile when args are not defined', (assert) => {
    const fn = () => minLength.compile('literal', 'array')
    assert.throw(fn, 'minLength: The 3rd arguments must be a combined array of arguments')
  })

  test('do not compile when length is not defined', (assert) => {
    const fn = () => minLength.compile('literal', 'array', [])
    assert.throw(fn, 'The limit value for "minLength" must be defined as a number')
  })

  test('do not compile node subtype is not array or string', (assert) => {
    const fn = () => minLength.compile('literal', 'object', [])
    assert.throw(fn, 'Cannot use "minLength" rule on "object" data type')
  })

  test('compile with options', (assert) => {
    assert.deepEqual(minLength.compile('literal', 'array', [10]), {
      name: 'minLength',
      allowUndefineds: false,
      async: false,
      compiledOptions: { minLength: 10 },
    })
  })

  test('skip when value is not an array or string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    minLength.validate({}, { minLength: 10 }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('raise error when string length is under the minLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    minLength.validate('hello', compile(10).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'minLength',
      args: { minLength: 10 },
      message: 'minLength validation failed',
    }])
  })

  test('raise error when array length is under the minLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    minLength.validate(['hello', 'world'], compile(3).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'minLength',
      args: { minLength: 3 },
      message: 'minLength validation failed',
    }])
  })

  test('work fine when string length is above or equals minLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    minLength.validate('helloworld', compile(10).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when array length is above or equals minLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    minLength.validate(['hello'], compile(1).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

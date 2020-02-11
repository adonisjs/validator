/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { validate } from '../fixtures/rules/index'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { maxLength } from '../../src/Validations/string-and-array/maxLength'

test.group('Max Length', () => {
  validate(maxLength, test, 'helloworld', 'hello', {
    options: 6,
  })

  test('skip when value is not an array or string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    maxLength.validate({}, { maxLength: 10 }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('raise error when string length is over the maxLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    maxLength.validate('hello-world', { maxLength: 10 }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'maxLength',
      args: { maxLength: 10 },
      message: 'maxLength validation failed',
    }])
  })

  test('raise error when array length is over the maxLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    maxLength.validate(['hello', 'world'], { maxLength: 1 }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'maxLength',
      args: { maxLength: 1 },
      message: 'maxLength validation failed',
    }])
  })

  test('work fine when string length is under or equals maxLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    maxLength.validate('helloworld', { maxLength: 10 }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when array length is under or equals maxLength', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    maxLength.validate(['hello'], { maxLength: 1 }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

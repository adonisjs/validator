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
import { number } from '../../src/Validations/primitives/number'

test.group('Number', () => {
  validate(number, test, 'helloworld', 10)

  test('report error when value is not a valid number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    number.validate(null, {}, {
      errorReporter: reporter,
      pointer: 'age',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'age',
      rule: 'number',
      message: 'number validation failed',
    }])
  })

  test('cast number like string to a valid number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = '22'

    number.validate(value, {}, {
      errorReporter: reporter,
      pointer: 'age',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), [])
    assert.equal(value, 22)
  })

  test('work fine when value is a valid number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    number.validate(22, {}, {
      errorReporter: reporter,
      pointer: 'age',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value is a string that cannot be casted to a number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    number.validate('hello-world', {}, {
      errorReporter: reporter,
      pointer: 'age',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'age',
      rule: 'number',
      message: 'number validation failed',
    }])
  })
})

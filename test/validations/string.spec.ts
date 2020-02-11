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
import { string } from '../../src/Validations/primitives/string'

test.group('String', () => {
  validate(string, test, 22, 'anystring')

  test('report error when value is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    string.validate(null, {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'string',
      message: 'string validation failed',
    }])
  })

  test('report error when value is a number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    string.validate(22, {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'string',
      message: 'string validation failed',
    }])
  })

  test('work fine when value is a valid string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    string.validate('22', {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

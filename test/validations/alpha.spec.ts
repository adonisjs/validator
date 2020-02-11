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
import { alpha } from '../../src/Validations/string/alpha'

test.group('Alpha', () => {
  validate(alpha, test, '9999', 'hello')

  test('ignore validation when value is not a valid string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    alpha.validate(null, {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value fails the alpha regex', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    alpha.validate('hello-22', {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'alpha',
      message: 'alpha validation failed',
    }])
  })

  test('work fine when value passes the alpha regex', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    alpha.validate('hello', {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

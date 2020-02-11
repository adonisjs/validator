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
import { array } from '../../src/Validations/primitives/array'

test.group('array', () => {
  validate(array, test, null, [])

  test('report error when value is not a valid array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    array.validate(null, {}, {
      errorReporter: reporter,
      pointer: 'addresses',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'addresses',
      rule: 'array',
      message: 'array validation failed',
    }])
  })

  test('work fine when value is a valid array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    array.validate([], {}, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

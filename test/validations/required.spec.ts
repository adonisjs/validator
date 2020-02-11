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
import { required } from '../../src/Validations/existence/required'

test.group('Required', () => {
  validate(required, test, undefined, 'anything')

  test('report error when value is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    required.validate(null, {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'required',
      message: 'required validation failed',
    }])
  })

  test('report error when value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    required.validate(undefined, {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'required',
      message: 'required validation failed',
    }])
  })

  test('report error when value is an empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    required.validate('', {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'required',
      message: 'required validation failed',
    }])
  })

  test('work fine when value is defined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    required.validate('virk', {}, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

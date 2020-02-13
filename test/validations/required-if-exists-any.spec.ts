/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { requiredIfExistsAny } from '../../src/Validations/existence/requiredIfExistsAny'

test.group('Required If Exists Any', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate(null, {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        user_id: 1,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAny',
      message: 'requiredIfExistsAny validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate(undefined, {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAny',
      message: 'requiredIfExistsAny validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAny',
      message: 'requiredIfExistsAny validation failed',
    }])
  })

  test('work fine when all of the target fields are undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when all of target fields are null or undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        user_id: null,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation matches and field has value', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAny.validate('hello', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

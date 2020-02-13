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
import { requiredIfNotExistsAny } from '../../src/Validations/existence/requiredIfNotExistsAny'

test.group('Required If Not Exists Any', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAny.validate(null, {
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
      rule: 'requiredIfNotExistsAny',
      message: 'requiredIfNotExistsAny validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAny.validate(undefined, {
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
      rule: 'requiredIfNotExistsAny',
      message: 'requiredIfNotExistsAny validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAny.validate('', {
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
      rule: 'requiredIfNotExistsAny',
      message: 'requiredIfNotExistsAny validation failed',
    }])
  })

  test('work fine when all of the target fields are defined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAny.validate('', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        user_id: 1,
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation matches and field has value', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAny.validate('hello', {
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

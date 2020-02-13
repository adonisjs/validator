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
import { requiredIfExistsAll } from '../../src/Validations/existence/requiredIfExistsAll'

test.group('Required If Exists All', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAll.validate(null, {
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

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAll',
      message: 'requiredIfExistsAll validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAll.validate(undefined, {
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

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAll',
      message: 'requiredIfExistsAll validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAll.validate('', {
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

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExistsAll',
      message: 'requiredIfExistsAll validation failed',
    }])
  })

  test('work fine when any of the target field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAll.validate('', {
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

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when any of target field is null or undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAll.validate('', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        user_id: null,
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation matches and field has value', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExistsAll.validate('hello', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
        user_id: 1,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

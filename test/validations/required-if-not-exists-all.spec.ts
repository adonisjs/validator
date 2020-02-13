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
import { requiredIfNotExistsAll } from '../../src/Validations/existence/requiredIfNotExistsAll'

test.group('Required If Not Exists All', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAll.validate(null, {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfNotExistsAll',
      message: 'requiredIfNotExistsAll validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAll.validate(undefined, {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: null,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfNotExistsAll',
      message: 'requiredIfNotExistsAll validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAll.validate('', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfNotExistsAll',
      message: 'requiredIfNotExistsAll validation failed',
    }])
  })

  test('work fine when all of the target fields are defined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExistsAll.validate('', {
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

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
import { requiredIfExists } from '../../src/Validations/existence/requiredIfExists'

test.group('Required If Exists', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate(null, {
      field: 'type',
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
      rule: 'requiredIfExists',
      message: 'requiredIfExists validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate(undefined, {
      field: 'type',
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
      rule: 'requiredIfExists',
      message: 'requiredIfExists validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('', {
      field: 'type',
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
      rule: 'requiredIfExists',
      message: 'requiredIfExists validation failed',
    }])
  })

  test('work fine when target field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('', {
      field: 'type',
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

  test('work fine when target field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('', {
      field: 'type',
    }, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: null,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation matches and field has value', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('hello', {
      field: 'type',
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

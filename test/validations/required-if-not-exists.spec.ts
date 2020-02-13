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
import { requiredIfNotExists } from '../../src/Validations/existence/requiredIfNotExists'

test.group('Required If Not Exists', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate(null, {
      field: 'token',
    }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'requiredIfNotExists',
      message: 'requiredIfNotExists validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate(undefined, {
      field: 'token',
    }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {
        token: null,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'requiredIfNotExists',
      message: 'requiredIfNotExists validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate('', {
      field: 'token',
    }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'requiredIfNotExists',
      message: 'requiredIfNotExists validation failed',
    }])
  })

  test('work fine when target field is defined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate('', {
      field: 'token',
    }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {
        token: '10100110',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate('hello', {
      field: 'token',
    }, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

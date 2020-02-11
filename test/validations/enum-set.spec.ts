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
import { enumSet } from '../../src/Validations/primitives/enumSet'

test.group('enum set', () => {
  validate(enumSet, test, ['10', '20'], ['1', '2'], {
    options: { choices: ['1', '2', '10'] },
  })

  test('report error when value all input values are not in the expected array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    enumSet.validate(['1', '2', '3'], { choices: ['1', '2'] }, {
      errorReporter: reporter,
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'points',
      args: {
        choices: ['1', '2'],
      },
      rule: 'enumSet',
      message: 'enumSet validation failed',
    }])
  })

  test('report error when value is not a valid array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    enumSet.validate('1', { choices: ['1', '2'] }, {
      errorReporter: reporter,
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'points',
      args: {
        choices: ['1', '2'],
      },
      rule: 'enumSet',
      message: 'enumSet validation failed',
    }])
  })

  test('work fine when value is a subset of defined array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    enumSet.validate(['1', '2'], { choices: ['1', '2', '3'] }, {
      errorReporter: reporter,
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

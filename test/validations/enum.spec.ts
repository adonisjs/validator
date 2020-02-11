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
import { oneOf } from '../../src/Validations/primitives/enum'

test.group('enum', () => {
  validate(oneOf, test, '10', '2', {
    options: { choices: ['1', '2'] },
  })

  test('report error when value is not in the defined array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    oneOf.validate('3', { choices: ['1', '2'] }, {
      errorReporter: reporter,
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'points',
      rule: 'enum',
      args: { choices: ['1', '2'] },
      message: 'enum validation failed',
    }])
  })

  test('report error when value is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    oneOf.validate(null, { choices: ['1', '2'] }, {
      errorReporter: reporter,
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'points',
      rule: 'enum',
      args: { choices: ['1', '2'] },
      message: 'enum validation failed',
    }])
  })

  test('work fine when value is in the defined array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    oneOf.validate('1', { choices: ['1', '2'] }, {
      errorReporter: reporter,
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

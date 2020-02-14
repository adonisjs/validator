/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { unsigned } from '../../src/Validations/number/unsigned'

function compile () {
  return unsigned.compile('literal', 'number', rules.unsigned().options)
}

test.group('unsigned', () => {
  validate(unsigned, test, -10, 10, compile())

  test('report error when value is not an unsigned number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    unsigned.validate(-10, compile().compiledOptions!, {
      errorReporter: reporter,
      pointer: 'age',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'age',
      rule: 'unsigned',
      message: 'unsigned validation failed',
    }])
  })

  test('skip when value is not a number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    unsigned.validate('-10', compile().compiledOptions!, {
      errorReporter: reporter,
      pointer: 'age',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when value is a valid unsigned value', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    unsigned.validate(1, compile().compiledOptions!, {
      errorReporter: reporter,
      pointer: 'age',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

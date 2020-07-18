/**
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
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { integer } from '../../src/Validations/number/integer'

function compile () {
  return integer.compile('literal', 'number', rules.integer().options)
}

test.group('integer', () => {
  validate(integer, test, 1.1, 10, compile())

  test('report error when value is not an integer number', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    integer.validate(1.1, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'age',
        rule: 'integer',
        message: 'integer validation failed',
      }],
    })
  })

  test('skip when value is not a number', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    integer.validate('1.1', compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value is a valid integer value', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    integer.validate(1, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

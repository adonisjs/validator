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
import { oneOf } from '../../src/Validations/primitives/enum'

function compile (choices: any[]) {
  return oneOf.compile('literal', 'enum', rules['enum'](choices).options)
}

test.group('enum', () => {
  validate(oneOf, test, '10', '2', compile(['1', '2']))

  test('do not compile when choices are not defined', (assert) => {
    const fn = () => oneOf.compile('literal', 'string')
    assert.throw(fn, 'enum: The 3rd arguments must be a combined array of arguments')
  })

  test('do not compile when choices not an array of values', (assert) => {
    const fn = () => oneOf.compile('literal', 'string', ['foo'])
    assert.throw(fn, 'The "enum" rule expects an array of choices')
  })

  test('report error when value is not in the defined array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    oneOf.validate('3', compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'points',
        rule: 'enum',
        args: { choices: ['1', '2'] },
        message: 'enum validation failed',
      }],
    })
  })

  test('report error when value is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    oneOf.validate(null, compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'points',
        rule: 'enum',
        args: { choices: ['1', '2'] },
        message: 'enum validation failed',
      }],
    })
  })

  test('work fine when value is in the defined array', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    oneOf.validate('1', compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

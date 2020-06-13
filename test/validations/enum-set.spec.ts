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
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { enumSet } from '../../src/Validations/primitives/enumSet'

function compile (choices: any[]) {
  return enumSet.compile('literal', 'enumSet', rules['enumSet'](choices).options)
}

test.group('enum set', () => {
  validate(enumSet, test, ['10', '20'], ['1', '2'], compile(['1', '2']))

  test('do not compile when choices are not defined', (assert) => {
    const fn = () => enumSet.compile('literal', 'string')
    assert.throw(fn, 'enumSet: The 3rd argument must be a combined array of arguments')
  })

  test('do not compile when choices not an array of values', (assert) => {
    const fn = () => enumSet.compile('literal', 'string', ['foo'])
    assert.throw(fn, 'The "enumSet" rule expects an array of choices')
  })

  test('report error when value all input values are not in the expected array', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    enumSet.validate(['1', '2', '3'], compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'points',
        args: {
          choices: ['1', '2'],
        },
        rule: 'enumSet',
        message: 'enumSet validation failed',
      }],
    })
  })

  test('report error when value is not a valid array', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    enumSet.validate('1', compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'points',
        args: {
          choices: ['1', '2'],
        },
        rule: 'enumSet',
        message: 'enumSet validation failed',
      }],
    })
  })

  test('work fine when value is a subset of defined array', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    enumSet.validate(['1', '2'], compile(['1', '2', '3']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

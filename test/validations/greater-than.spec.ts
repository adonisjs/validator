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
import { schema } from '../../src/Schema'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { greaterThan } from '../../src/Validations/miscellaneous/greaterThan'
import { NodeSubType } from '@ioc:Adonis/Core/Validator'

function compile(greaterThanValue: any, subtype?: NodeSubType) {
  // Regex Example for tax id validation from Brazil
  return greaterThan.compile(
    'literal',
    subtype || 'string',
    rules.greaterThan(greaterThanValue).options,
    {}
  )
}

test.group('greaterThan', () => {
  validate(greaterThan, test, 18, 20, compile(20))

  test('report error when value fails the greaterThan validation', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    greaterThan.validate(1, compile(2).compiledOptions, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'age',
          rule: 'greaterThan',
          message: 'greaterThan validation failed',
        },
      ],
    })
  })

  test('work fine when value passes the greaterThan validation', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    greaterThan.validate(20, compile(18).compiledOptions, {
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

  test('work fine when value passes the greaterThan validation with refs', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    const validator = {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: schema.refs({
        refValue: 20,
      }),
      mutate: () => {},
    }

    greaterThan.validate(21, compile(validator.refs.refValue).compiledOptions!, validator)

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

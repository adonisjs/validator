/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { rules } from '../../src/rules/index.js'
import { schema } from '../../src/schema/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { equalTo } from '../../src/validations/string/equal_to.js'

function compile(equalToValue: any) {
  // Regex Example for tax id validation from Brazil
  return equalTo.compile('literal', 'string', rules.equalTo(equalToValue).options, {})
}

test.group('equalTo', () => {
  validate(equalTo, test, 'bar', 'foo', compile('foo'))

  test('compile equalTo rule', ({ assert }) => {
    const { compiledOptions } = equalTo.compile('literal', 'string', rules.equalTo('foo').options)
    assert.deepEqual(compiledOptions, { fieldValue: 'foo' })
  })

  test('ignore validation when value is not a valid string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    equalTo.validate(null, compile('foo').compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value fails the equalTo validation', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    equalTo.validate('bar', compile('foo').compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'equalTo',
          message: 'equalTo validation failed',
        },
      ],
    })
  })

  test('work fine when value passes the equalTo validation', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    equalTo.validate('foo', compile('foo').compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value passes the equalTo validation with refs', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    const validator = {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: schema.refs({
        refValue: 'foo',
      }),
      mutate: () => {},
    }

    equalTo.validate('foo', compile(validator.refs.refValue).compiledOptions!, validator)

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

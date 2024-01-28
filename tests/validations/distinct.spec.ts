/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { distinct } from '../../src/validations/array/distinct.js'

function compile(field: string) {
  return distinct.compile('literal', 'array', rules.distinct(field).options, {})
}

test.group('Distinct', () => {
  validate(
    distinct,
    test,
    [{ username: 'virk' }, { username: 'virk' }],
    [{ username: 'virk' }, { username: 'nikk' }],
    compile('username')
  )

  test('ignore validation when value is not an array', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    distinct.validate({ foo: 'bar' }, compile('username').compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when field value is not unique in an array of objects', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    distinct.validate(
      [{ foo: 'bar' }, { foo: 'bar' }, { foo: 'baz' }],
      compile('foo').compiledOptions,
      {
        errorReporter: reporter,
        field: 'foo_collection',
        pointer: 'foo_collection',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          args: {
            field: 'foo',
            index: 1,
          },
          field: 'foo_collection',
          message: 'distinct validation failed',
          rule: 'distinct',
        },
      ],
    })
  })

  test('report error when top level array values are not unique', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    distinct.validate([10, 20, 10, 5], compile('*').compiledOptions, {
      errorReporter: reporter,
      field: 'marks',
      pointer: 'marks',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          args: {
            field: 2,
            index: 2,
          },
          field: 'marks',
          message: 'distinct validation failed',
          rule: 'distinct',
        },
      ],
    })
  })

  test('work fine when values are unique', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    distinct.validate([{ foo: 'bar' }, { foo: 'baz' }], compile('foo').compiledOptions, {
      errorReporter: reporter,
      field: 'foo_collection',
      pointer: 'foo_collection',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when top level array values are unique', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    distinct.validate([10, 20, 5], compile('*').compiledOptions, {
      errorReporter: reporter,
      field: 'marks',
      pointer: 'marks',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

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
import { requiredIfNotExistsAny } from '../../src/Validations/existence/requiredIfNotExistsAny'

function compile(fields: string[]) {
  return requiredIfNotExistsAny.compile(
    'literal',
    'string',
    rules.requiredIfNotExistsAny(fields).options,
    {}
  )
}

test.group('Required If Not Exists Any', () => {
  validate(requiredIfNotExistsAny, test, undefined, 'foo', compile(['id', 'type']), {
    tip: { id: 1 },
  })

  test('do not compile when args are not defined', (assert) => {
    const fn = () => requiredIfNotExistsAny.compile('literal', 'string')
    assert.throw(
      fn,
      '"requiredIfNotExistsAny": The 3rd argument must be a combined array of arguments'
    )
  })

  test('do not compile when fields are not defined', (assert) => {
    const fn = () => requiredIfNotExistsAny.compile('literal', 'string', [])
    assert.throw(fn, '"requiredIfNotExistsAny": expects an array of "fields"')
  })

  test('do not compile when fields are not defined as an array', (assert) => {
    const fn = () => requiredIfNotExistsAny.compile('literal', 'string', ['foo'])
    assert.throw(fn, '"requiredIfNotExistsAny": expects "fields" to be an array')
  })

  test('compile with options', (assert) => {
    assert.deepEqual(requiredIfNotExistsAny.compile('literal', 'string', [['foo']]), {
      name: 'requiredIfNotExistsAny',
      allowUndefineds: true,
      async: false,
      compiledOptions: { fields: ['foo'] },
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAny.validate(null, compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
        user_id: 1,
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'profile_id',
          rule: 'requiredIfNotExistsAny',
          message: 'requiredIfNotExistsAny validation failed',
          args: {
            otherFields: ['type', 'user_id'],
          },
        },
      ],
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAny.validate(undefined, compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'profile_id',
          rule: 'requiredIfNotExistsAny',
          message: 'requiredIfNotExistsAny validation failed',
          args: {
            otherFields: ['type', 'user_id'],
          },
        },
      ],
    })
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAny.validate('', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'profile_id',
          rule: 'requiredIfNotExistsAny',
          message: 'requiredIfNotExistsAny validation failed',
          args: {
            otherFields: ['type', 'user_id'],
          },
        },
      ],
    })
  })

  test('work fine when all of the target fields are defined', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAny.validate('', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
        user_id: 1,
        type: 'twitter',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when expectation matches and field has value', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAny.validate('hello', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

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
import { requiredIfNotExistsAll } from '../../src/Validations/existence/requiredIfNotExistsAll'

function compile (fields: string[]) {
  return requiredIfNotExistsAll.compile(
    'literal',
    'string',
    rules.requiredIfNotExistsAll(fields).options,
  )
}

test.group('Required If Not Exists All', () => {
  validate(requiredIfNotExistsAll, test, undefined, 'foo', compile(['id', 'twitter']), {
    tip: {},
  })

  test('do not compile when args are not defined', (assert) => {
    const fn = () => requiredIfNotExistsAll.compile('literal', 'string')
    assert.throw(fn, 'requiredIfNotExistsAll: The 3rd argument must be a combined array of arguments')
  })

  test('do not compile when fields are not defined', (assert) => {
    const fn = () => requiredIfNotExistsAll.compile('literal', 'string', [])
    assert.throw(fn, 'requiredIfNotExistsAll: expects an array of "fields"')
  })

  test('do not compile when fields are not defined as array', (assert) => {
    const fn = () => requiredIfNotExistsAll.compile('literal', 'string', ['foo'])
    assert.throw(fn, 'requiredIfNotExistsAll: expects "fields" to be an array')
  })

  test('compile with options', (assert) => {
    assert.deepEqual(requiredIfNotExistsAll.compile('literal', 'string', [['foo']]), {
      name: 'requiredIfNotExistsAll',
      async: false,
      allowUndefineds: true,
      compiledOptions: { fields: ['foo'] },
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAll.validate(null, compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'profile_id',
        rule: 'requiredIfNotExistsAll',
        message: 'requiredIfNotExistsAll validation failed',
        args: {
          otherFields: ['type', 'user_id'],
        },
      }],
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAll.validate(undefined, compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
        type: null,
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'profile_id',
        rule: 'requiredIfNotExistsAll',
        message: 'requiredIfNotExistsAll validation failed',
        args: {
          otherFields: ['type', 'user_id'],
        },
      }],
    })
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAll.validate('', {
      fields: ['type', 'user_id'],
    }, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'profile_id',
        rule: 'requiredIfNotExistsAll',
        message: 'requiredIfNotExistsAll validation failed',
        args: {
          otherFields: ['type', 'user_id'],
        },
      }],
    })
  })

  test('work fine when all of the target fields are defined', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    requiredIfNotExistsAll.validate('', compile(['type', 'user_id']).compiledOptions!, {
      errorReporter: reporter,
      field: 'profile_id',
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
        user_id: 1,
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

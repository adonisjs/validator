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
import { requiredIfNotExists } from '../../src/Validations/existence/requiredIfNotExists'

function compile (field: string) {
  return requiredIfNotExists.compile(
    'literal',
    'string',
    rules.requiredIfNotExists(field).options,
  )
}

test.group('Required If Not Exists', () => {
  validate(requiredIfNotExists, test, undefined, 'foo', compile('id'))

  test('do not compile when args are not defined', (assert) => {
    const fn = () => requiredIfNotExists.compile('literal', 'string')
    assert.throw(fn, 'requiredIfNotExists: The 3rd arguments must be a combined array of arguments')
  })

  test('do not compile when field is not defined', (assert) => {
    const fn = () => requiredIfNotExists.compile('literal', 'string', [])
    assert.throw(fn, 'requiredIfNotExists: expects a "field"')
  })

  test('compile with options', (assert) => {
    assert.deepEqual(requiredIfNotExists.compile('literal', 'string', ['foo']), {
      name: 'requiredIfNotExists',
      allowUndefineds: true,
      async: false,
      compiledOptions: { field: 'foo' },
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate(null, compile('token').compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'username',
        rule: 'requiredIfNotExists',
        message: 'requiredIfNotExists validation failed',
      }],
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate(undefined, compile('token').compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
        token: null,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'username',
        rule: 'requiredIfNotExists',
        message: 'requiredIfNotExists validation failed',
      }],
    })
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate('', compile('token').compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'username',
        rule: 'requiredIfNotExists',
        message: 'requiredIfNotExists validation failed',
      }],
    })
  })

  test('work fine when target field is defined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate('', compile('token').compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
        token: '10100110',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfNotExists.validate('hello', compile('token').compiledOptions!, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { UUIDVersion } from 'class-validator'

import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { uuid } from '../../src/Validations/string/uuid'

function compile (options?: { version?: UUIDVersion }) {
  return uuid.compile('literal', 'string', rules.uuid(options).options)
}

const v3 = '94ccbc1e-862e-31ea-bc55-0242ac130003'
const v4 = '3ddcf668-ef98-4b30-a8bc-545b8394c81c'
const v5 = '3ddcf668-ef98-5b30-a8bc-545b8394c81c'

test.group('UUID', () => {
  validate(uuid, test, 'not-a-uuid', v4, compile())

  test('ignore validation when value is not a valid string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    uuid.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'uuid',
      pointer: 'uuid',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value fails the uuid validation', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    uuid.validate('not-a-uuid', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'uuid',
      pointer: 'uuid',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'uuid',
      rule: 'uuid',
      message: 'uuid validation failed',
    }])
  })

  test('work fine when implicitly checking v4', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    uuid.validate(v4, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'uuid',
      pointer: 'uuid',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when checking v3 against default (v4)', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    uuid.validate(v3, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'uuid',
      pointer: 'uuid',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      rule: 'uuid',
      field: 'uuid',
      message: 'uuid validation failed',
    }])
  })

  test('work fine when explicitly validating v3', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    uuid.validate(v3, compile({ version: 3 }).compiledOptions, {
      errorReporter: reporter,
      field: 'uuid',
      pointer: 'uuid',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when explicitly validating v4', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    uuid.validate(v4, compile({ version: 4 }).compiledOptions, {
      errorReporter: reporter,
      field: 'uuid',
      pointer: 'uuid',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when explicitly validating v5', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    uuid.validate(v5, compile({ version: 5 }).compiledOptions, {
      errorReporter: reporter,
      field: 'uuid',
      pointer: 'uuid',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

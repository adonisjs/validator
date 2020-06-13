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
import { boolean } from '../../src/Validations/primitives/boolean'

function compile () {
  return boolean.compile('literal', 'boolean', rules['boolean']().options)
}

test.group('boolean', () => {
  validate(boolean, test, 'hello', '0', compile())

  test('report error when value is not a valid boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    boolean.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'terms',
        rule: 'boolean',
        message: 'boolean validation failed',
      }],
    })
  })

  test('cast positive numeric representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = 1

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, true)
  })

  test('cast positive string representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '1'

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, true)
  })

  test('cast on keyword to a positive boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = 'on'

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, true)
  })

  test('cast 0 numeric representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = 0

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, false)
  })

  test('cast 0 string representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '0'

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, false)
  })

  test('cast off keyword as negative boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = 'off'

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, false)
  })

  test('work fine when value is a positive boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = true

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, true)
  })

  test('work fine when value is a negative boolean', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = false

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'terms',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, false)
  })
})

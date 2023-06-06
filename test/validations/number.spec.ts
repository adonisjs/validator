/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { number } from '../../src/Validations/primitives/number'

function compile() {
  return number.compile('literal', 'number', rules['number']().options, {})
}

test.group('Number', () => {
  validate(number, test, 'helloworld', 10, compile())

  test('report error when value is near Infinity', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    number.validate(
      '-3177777777777777777777777777777777777777777777777777777777777777777777777770000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
      compile().compiledOptions,
      {
        errorReporter: reporter,
        field: 'age',
        pointer: 'age',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'age',
          rule: 'number',
          message: 'number validation failed',
        },
      ],
    })
  })

  test('report error when value is not a valid number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    number.validate(null, compile().compiledOptions, {
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
          rule: 'number',
          message: 'number validation failed',
        },
      ],
    })
  })

  test('cast number like string to a valid number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '22'

    number.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
    assert.equal(value, 22)
  })

  test('work fine when value is a valid number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    number.validate(22, compile().compiledOptions, {
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

  test('report error when value is a string that cannot be casted to a number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    number.validate('hello-world', compile().compiledOptions, {
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
          rule: 'number',
          message: 'number validation failed',
        },
      ],
    })
  })
})

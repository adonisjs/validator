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
import { bigint } from '../../src/Validations/primitives/bigint'

function compile() {
  return bigint.compile('literal', 'bigint', rules['bigint']().options, {})
}

test.group('BigInt', () => {
  validate(bigint, test, 'helloworld', 10n, compile())

  test('work fine when value is near Infinity', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    bigint.validate(
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

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value is not a valid bigint', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    bigint.validate(null, compile().compiledOptions, {
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
          rule: 'bigint',
          message: 'bigint validation failed',
        },
      ],
    })
  })

  test('cast bigint like string to a valid bigint', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '21'

    bigint.validate(value, compile().compiledOptions, {
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
    assert.equal(value, 21n)
  })

  test('work fine when value is a valid bigint', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    bigint.validate(21n, compile().compiledOptions, {
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

  test('report error when value is a string that cannot be casted to a bigint', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    bigint.validate('hello-world', compile().compiledOptions, {
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
          rule: 'bigint',
          message: 'bigint validation failed',
        },
      ],
    })
  })

  test('cast number to a valid bigint', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = 21

    bigint.validate(value, compile().compiledOptions, {
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
    assert.equal(value, 21n)
  })
})

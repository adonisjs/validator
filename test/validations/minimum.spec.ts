import { test } from '@japa/runner'
import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { range } from '../../src/Validations/number/range'
import { minimum } from '../../src/Validations/number/minimum'

function compile(min: number) {
  return minimum.compile('literal', 'number', rules.minimum(min).options, {})
}

test.group('min', () => {
  validate(minimum, test, 0, 2, compile(1))

  test('do not compile when min is not a number', ({ assert }) => {
    const fn = () => range.compile('literal', 'number', ['10'])
    assert.throws(fn, 'The start value for "range" must be defined as number')
  })

  test('report error when value is lower than the min', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minimum.validate(0, compile(10).compiledOptions!, {
      errorReporter: reporter,
      field: 'price',
      pointer: 'price',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'price',
          rule: 'min',
          args: {
            min: 10,
          },
          message: 'min validation failed',
        },
      ],
    })
  })

  test('skip when value is not a number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minimum.validate('-10', compile(1).compiledOptions!, {
      errorReporter: reporter,
      field: 'price',
      pointer: 'price',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value is a valid number bigger than min', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    minimum.validate(25, compile(1).compiledOptions!, {
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
})

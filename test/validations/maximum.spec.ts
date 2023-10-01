import { test } from '@japa/runner'
import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { maximum } from '../../src/Validations/number/maximum'

function compile(max: number) {
  return maximum.compile('literal', 'number', rules.maximum(max).options, {})
}

test.group('max', () => {
  validate(maximum, test, 3, 1, compile(2))

  test('do not compile when max is not a number', ({ assert }) => {
    const fn = () => maximum.compile('literal', 'number', ['10'])
    assert.throws(fn, 'The start value for "max" must be defined as number')
  })

  test('report error when value is bigger than the max', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maximum.validate(11, compile(10).compiledOptions!, {
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
          rule: 'max',
          args: {
            max: 10,
          },
          message: 'max validation failed',
        },
      ],
    })
  })

  test('skip when value is not a number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maximum.validate('-10', compile(1).compiledOptions!, {
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

  test('work fine when value is a valid number lower than max', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    maximum.validate(25, compile(30).compiledOptions!, {
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

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { date } from '../../src/validations/primitives/date.js'

function compile(options: { format?: string }) {
  return date.compile('literal', 'date', (rules as any)['date'](options).options, {})
}

test.group('Date', () => {
  validate(date, test, 22, '2020-10-20', compile({}))

  test('report error when value is null', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    date.validate(null, compile({}).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'dob',
          rule: 'date',
          message: 'date validation failed',
          args: { format: undefined },
        },
      ],
    })
  })

  test('report error when value is a number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    date.validate(22, compile({}).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'dob',
          rule: 'date',
          message: 'date validation failed',
          args: { format: undefined },
        },
      ],
    })
  })

  test('work fine when value is a valid date string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '2020-10-20'

    date.validate(value, compile({}).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value is invalid as per expected pre-defined format', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    date.validate('2020-21-10', compile({ format: 'iso' }).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'dob',
          rule: 'date.format',
          message: 'you specified 21 (of type number) as a month, which is invalid',
          args: { format: 'iso' },
        },
      ],
    })
  })

  test('work fine when valid is valid as per pre-defined format', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '2020-10-21'

    date.validate('2020-10-21', compile({ format: 'iso' }).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value is invalid as per expected custom format', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    date.validate('2020-10-21', compile({ format: 'yyyy-dd-MM' }).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'dob',
          rule: 'date.format',
          message: 'you specified 21 (of type number) as a month, which is invalid',
          args: { format: 'yyyy-dd-MM' },
        },
      ],
    })
  })

  test('work fine when valid is valid as per custom format', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '2020-10-21'

    date.validate('2020-10-21', compile({ format: 'yyyy-MM-dd' }).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value is an instance of date and format is defined', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    date.validate(new Date(), compile({ format: 'yyyy-dd-MM' }).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'dob',
          rule: 'date',
          message: 'cannot validate date instance against a date format',
          args: { format: 'yyyy-dd-MM' },
        },
      ],
    })
  })

  test('work fine when value is an instance of date', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = new Date()

    date.validate(value, compile({}).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value is an instance of luxon date time', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = DateTime.local()

    date.validate(value, compile({}).compiledOptions!, {
      errorReporter: reporter,
      field: 'dob',
      pointer: 'dob',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

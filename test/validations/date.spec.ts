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
import { date } from '../../src/Validations/primitives/date'
import { DateTime, DateTimeOptions } from 'luxon'

function compile(options: { format?: string; opts?: DateTimeOptions }) {
  return date.compile('literal', 'date', rules['date'](options).options, {})
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

  test('report error when value is valid but a option is invalid', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    date.validate(
      '2020-12-10',
      compile({ format: 'iso', opts: { zone: 'INVALID' } }).compiledOptions!,
      {
        errorReporter: reporter,
        field: 'dob',
        pointer: 'dob',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'dob',
          rule: 'date.format',
          message: 'the zone "INVALID" is not supported',
          args: { format: 'iso' },
        },
      ],
    })
  })

  test('work fine when value is valid as per pre-defined format with opts', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value: any = '2023-09-28T21:05:05.903Z'

    date.validate(
      '2023-09-28T21:05:05.903Z',
      compile({ format: 'iso', opts: { zone: 'UTC-4' } }).compiledOptions!,
      {
        errorReporter: reporter,
        field: 'dob',
        pointer: 'dob',
        tip: {},
        root: {},
        refs: {},
        mutate: (newValue) => {
          value = newValue
        },
      }
    )

    assert.instanceOf(value, DateTime)
    assert.deepEqual(value.zoneName, 'UTC-4')
    assert.deepEqual(value.toString(), '2023-09-28T17:05:05.903-04:00')
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

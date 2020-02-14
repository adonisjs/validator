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
import { date } from '../../src/Validations/primitives/date'
import { DateTime } from 'luxon'

function compile (options: { format?: string }) {
  return date.compile('literal', 'date', rules['date'](options).options)
}

test.group('Date', () => {
  validate(date, test, 22, '2020-10-20', compile({}))

  test('report error when value is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    date.validate(null, compile({}).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'dob',
      rule: 'date',
      message: 'date validation failed',
    }])
  })

  test('report error when value is a number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    date.validate(22, compile({}).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'dob',
      rule: 'date',
      message: 'date validation failed',
    }])
  })

  test('work fine when value is a valid date string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = '2020-10-20'

    date.validate(value, compile({}).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value is invalid as per expected pre-defined format', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    date.validate('2020-21-10', compile({ format: 'iso' }).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'dob',
      rule: 'date.format',
      message: 'you specified 21 (of type number) as a month, which is invalid',
    }])
  })

  test('work fine when valid is valid as per pre-defined format', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = '2020-10-21'

    date.validate('2020-10-21', compile({ format: 'iso' }).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value is invalid as per expected custom format', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    date.validate('2020-10-21', compile({ format: 'yyyy-dd-MM' }).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'dob',
      rule: 'date.format',
      message: 'you specified 21 (of type number) as a month, which is invalid',
    }])
  })

  test('work fine when valid is valid as per custom format', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = '2020-10-21'

    date.validate('2020-10-21', compile({ format: 'yyyy-MM-dd' }).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value is an instance of date and format is defined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    date.validate(new Date(), compile({ format: 'yyyy-dd-MM' }).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'dob',
      rule: 'date',
      message: 'cannot validate data instance against a date format',
    }])
  })

  test('work fine when value is an instance of date', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = new Date()

    date.validate(value, compile({}).compiledOptions!, {
      errorReporter: reporter,
      pointer: 'dob',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.instanceOf(value, DateTime)
    assert.deepEqual(reporter.toJSON(), [])
  })
})

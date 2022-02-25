/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { SchemaRef, ParsedRule, DurationUnits } from '@ioc:Adonis/Core/Validator'

import { rules } from '../../src/Rules'
import { schema } from '../../src/Schema'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { afterOrEqual } from '../../src/Validations'

function compile(keyword: 'today' | 'tomorrow'): ParsedRule<any>
// eslint-disable-next-line no-redeclare
function compile(date: SchemaRef<DateTime>): ParsedRule<any>
// eslint-disable-next-line no-redeclare
function compile(interval: number, duration: DurationUnits): ParsedRule<any>
// eslint-disable-next-line no-redeclare
function compile(
  interval: number | SchemaRef<DateTime> | 'today' | 'tomorrow',
  duration?: DurationUnits
): ParsedRule<any> {
  const { options } =
    typeof interval === 'number'
      ? rules.afterOrEqual(interval, duration!)
      : typeof interval === 'string'
      ? rules.afterOrEqual(interval)
      : rules.afterOrEqual(interval)

  return afterOrEqual.compile('literal', 'date', options)
}

test.group('Date | After Or Equal', () => {
  validate(
    afterOrEqual,
    test,
    DateTime.local(),
    DateTime.local().plus({ days: 2 }),
    compile(1, 'day'),
    {}
  )

  test('do not compile when one argument is passed and is not a ref', ({ assert }) => {
    const fn = () => afterOrEqual.compile('literal', 'date', ['foo'])
    assert.throws(fn, '"afterOrEqual": expects a date offset "duration" and "unit" or a "ref"')
  })

  test('do not compile when interval is not a number', ({ assert }) => {
    const fn = () => afterOrEqual.compile('literal', 'date', ['foo', 'days'])
    assert.throws(fn, '"afterOrEqual": expects "duration" to be a number')
  })

  test('do not compile when interval no arguments are defined', ({ assert }) => {
    const fn = () => afterOrEqual.compile('literal', 'date', [])
    assert.throws(fn, '"afterOrEqual": expects a date offset "duration" and "unit" or a "ref"')
  })
})

test.group('Date | After Or Equal | Day', () => {
  test('report error when date is not after or equal to defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().toISODate()

    afterOrEqual.validate(DateTime.fromISO(publishedOn!), compile(1, 'day').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_on')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('report error when datetime is not after or equal to defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().minus({ days: 1 }).toISO()

    afterOrEqual.validate(DateTime.fromISO(publishedOn!), compile(1, 'day').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_on')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('work fine when date is after or equal to defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().plus({ days: 2 }).toISO()
    const publishedOnSameDate = DateTime.local().plus({ days: 1 }).toISO()

    afterOrEqual.validate(DateTime.fromISO(publishedOn!), compile(1, 'day').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    afterOrEqual.validate(
      DateTime.fromISO(publishedOnSameDate!),
      compile(1, 'day').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'published_on',
        pointer: 'published_on',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('return error when date is not after or equal to today', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().minus({ day: 1 }).toISODate()

    afterOrEqual.validate(DateTime.fromISO(publishedOn!), compile('today').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_on')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('work fine when date is after or equal to today', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().plus({ days: 1 }).toISODate()
    const publishedOnSameDate = DateTime.local().toISODate()

    afterOrEqual.validate(DateTime.fromISO(publishedOn!), compile('today').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    afterOrEqual.validate(
      DateTime.fromISO(publishedOnSameDate!),
      compile('today').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'published_on',
        pointer: 'published_on',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('return error when date is not after or equal to tomorrow', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().toISODate()

    afterOrEqual.validate(DateTime.fromISO(publishedOn!), compile('tomorrow').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_on')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('work fine when date is after or equal to tomorrow', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().plus({ days: 2 }).toISODate()
    const publishedOnTomorrow = DateTime.local().plus({ days: 1 }).toISODate()

    afterOrEqual.validate(DateTime.fromISO(publishedOn!), compile('tomorrow').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    afterOrEqual.validate(
      DateTime.fromISO(publishedOnTomorrow!),
      compile('tomorrow').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'published_on',
        pointer: 'published_on',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })
})

test.group('Date | After Or Equal | Minutes', () => {
  test('report error when time is not defined for the same day', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISODate()

    afterOrEqual.validate(DateTime.fromISO(publishedAt!), compile(30, 'minutes').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('report error when time is not after or equal to the defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISO()

    afterOrEqual.validate(DateTime.fromISO(publishedAt!), compile(30, 'minutes').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('work fine when time is after or equal to the defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().plus({ minutes: 40 }).toISO()

    /*
    Incrementing minutes only with .plus() with make this test fails because its milliseconds and seconds will always lesser than
    the one that produce in "src/Validations/date/helpers/offset.ts". Hence, setting the max seconds and milliseconds to force
    this test compares equality in minutes only.
    */
    const local = DateTime.local()
    const publishedAtSameTime = DateTime.local(
      local.year,
      local.month,
      local.day,
      local.hour,
      local.minute,
      59,
      999
    )
      .plus({ minutes: 30 })
      .toISO()

    afterOrEqual.validate(DateTime.fromISO(publishedAt!), compile(30, 'minutes').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    afterOrEqual.validate(
      DateTime.fromISO(publishedAtSameTime!),
      compile(30, 'minutes').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'published_at',
        pointer: 'published_at',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when time is not defined for next day', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().plus({ days: 1 }).toISODate()

    afterOrEqual.validate(DateTime.fromISO(publishedAt!), compile(30, 'minutes').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })
})

test.group('Date | After Or Equal | Ref', () => {
  test('report error when date is before the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISODate()
    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        afterDate: DateTime.local().plus({ days: 10 }),
      }),
      mutate: () => {},
    }

    afterOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('report error when datetime is before the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISO()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        afterDate: DateTime.local().plus({ minutes: 30 }),
      }),
      mutate: () => {},
    }

    afterOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('report error when time is not defined for the same day', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().plus({ minutes: 30 }).toISODate()
    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        afterDate: DateTime.local().plus({ minutes: 10 }),
      }),
      mutate: () => {},
    }

    afterOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'afterOrEqual')
    assert.equal(errors.errors[0].message, 'afterOrEqual date validation failed')
  })

  test('work fine when date is after or equal to the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().plus({ days: 11 }).toISODate()

    /* 
      Using toISO because toISODate will not include hours, minutes, seconds, ...
      So if later when it get converted to datetime again, the test will fail 
      because `publishedAtSameDate` would then have 0 in hours, minutes, seconds, ... but datetime in ref is not.
    */
    const publishedAtSameDate = DateTime.local().plus({ days: 10 }).toISO()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        afterDate: DateTime.local().plus({ days: 10 }),
      }),
      mutate: () => {},
    }

    afterOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    afterOrEqual.validate(
      DateTime.fromISO(publishedAtSameDate),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when datetime is after or equal to the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().plus({ minutes: 30 }).toISO()
    const publishedAtSameDateTime = DateTime.local().plus({ minutes: 10 }).toISO()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        afterDate: DateTime.local().plus({ minutes: 10 }),
      }),
      mutate: () => {},
    }

    afterOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    afterOrEqual.validate(
      DateTime.fromISO(publishedAtSameDateTime!),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when time is not defined for the next day', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().plus({ days: 1 }).toISODate()
    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        afterDate: DateTime.local().plus({ minutes: 10 }),
      }),
      mutate: () => {},
    }

    afterOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.afterDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })
})

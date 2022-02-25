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
import { beforeOrEqual } from '../../src/Validations'

function compile(keyword: 'today' | 'yesterday'): ParsedRule<any>
// eslint-disable-next-line no-redeclare
function compile(date: SchemaRef<DateTime>): ParsedRule<any>
// eslint-disable-next-line no-redeclare
function compile(interval: number, duration: DurationUnits): ParsedRule<any>
// eslint-disable-next-line no-redeclare
function compile(
  interval: number | SchemaRef<DateTime> | 'today' | 'yesterday',
  duration?: DurationUnits
): ParsedRule<any> {
  const { options } =
    typeof interval === 'number'
      ? rules.beforeOrEqual(interval, duration!)
      : typeof interval === 'string'
      ? rules.beforeOrEqual(interval)
      : rules.beforeOrEqual(interval)

  return beforeOrEqual.compile('literal', 'date', options, {})
}

test.group('Date | Before Or Equal ', () => {
  validate(
    beforeOrEqual,
    test,
    DateTime.local(),
    DateTime.local().minus({ days: 2 }),
    compile(1, 'day')
  )

  test('do not compile when one argument is passed and is not a ref', ({ assert }) => {
    const fn = () => beforeOrEqual.compile('literal', 'date', ['foo'])
    assert.throws(fn, '"beforeOrEqual": expects a date offset "duration" and "unit" or a "ref"')
  })

  test('do not compile when interval is not a number', ({ assert }) => {
    const fn = () => beforeOrEqual.compile('literal', 'date', ['foo', 'days'])
    assert.throws(fn, '"beforeOrEqual": expects "duration" to be a number')
  })

  test('do not compile when interval no arguments are defined', ({ assert }) => {
    const fn = () => beforeOrEqual.compile('literal', 'date', [])
    assert.throws(fn, '"beforeOrEqual": expects a date offset "duration" and "unit" or a "ref"')
  })
})

test.group('Date | Before Or Equal | Day', () => {
  test('report error when date is not before or equal to defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().toISODate()

    beforeOrEqual.validate(DateTime.fromISO(publishedOn!), compile(1, 'day').compiledOptions!, {
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
    assert.equal(errors.errors[0].rule, 'beforeOrEqual')
    assert.equal(errors.errors[0].message, 'beforeOrEqual date validation failed')
  })

  /**
   * The time should have no relevance in case of `days` offset
   */
  test('report error when datetime is not before or equal to defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().toISO()

    beforeOrEqual.validate(DateTime.fromISO(publishedOn!), compile(1, 'day').compiledOptions!, {
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
    assert.equal(errors.errors[0].rule, 'beforeOrEqual')
    assert.equal(errors.errors[0].message, 'beforeOrEqual date validation failed')
  })

  test('work fine when date is before or equal to defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().minus({ days: 2 }).toISO()
    const publishedOnSameDate = DateTime.local().minus({ days: 1 }).toISO()

    beforeOrEqual.validate(DateTime.fromISO(publishedOn!), compile(1, 'day').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    beforeOrEqual.validate(
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

  test('report error when date is not before or equal to today', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().plus({ days: 1 }).toISODate()

    beforeOrEqual.validate(DateTime.fromISO(publishedOn!), compile('today').compiledOptions!, {
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
    assert.equal(errors.errors[0].rule, 'beforeOrEqual')
    assert.equal(errors.errors[0].message, 'beforeOrEqual date validation failed')
  })

  test('work fine when date is before or equal to today', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().minus({ days: 1 }).toISODate()
    const publishedOnSameDate = DateTime.local().toISODate()

    beforeOrEqual.validate(DateTime.fromISO(publishedOn!), compile('today').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    beforeOrEqual.validate(
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

  test('report error when date is not yesterday today', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().plus({ days: 1 }).toISODate()

    beforeOrEqual.validate(DateTime.fromISO(publishedOn!), compile('yesterday').compiledOptions!, {
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
    assert.equal(errors.errors[0].rule, 'beforeOrEqual')
    assert.equal(errors.errors[0].message, 'beforeOrEqual date validation failed')
  })

  test('work fine when date is before or equal to yesterday', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedOn = DateTime.local().minus({ days: 2 }).toISODate()
    const publishedOnSameDate = DateTime.local().minus({ days: 1 }).toISODate()

    beforeOrEqual.validate(DateTime.fromISO(publishedOn!), compile('yesterday').compiledOptions!, {
      errorReporter: reporter,
      field: 'published_on',
      pointer: 'published_on',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    beforeOrEqual.validate(
      DateTime.fromISO(publishedOnSameDate!),
      compile('yesterday').compiledOptions!,
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

test.group('Date | Before Or Equal | Minutes', () => {
  test('work fine when time is not defined for the same day', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISODate()

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
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

  test('report error when time is not before or equal to the defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISO()

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
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
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'beforeOrEqual')
    assert.equal(errors.errors[0].message, 'beforeOrEqual date validation failed')
  })

  test('work fine when time is before or equal to the defined interval', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().minus({ minutes: 40 }).toISO()
    const publishedAtSameTime = DateTime.local().minus({ minutes: 30 }).toISO()

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
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

    beforeOrEqual.validate(
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

  test('work fine when time is not defined for yesterday', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().minus({ days: 1 }).toISODate()

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
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
})

test.group('Date | Before Or Equal | Ref', () => {
  test('report error when date is not before or equal to the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISODate()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        beforeDate: DateTime.local().minus({ days: 10 }),
      }),
      mutate: () => {},
    }

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'beforeOrEqual')
    assert.equal(errors.errors[0].message, 'beforeOrEqual date validation failed')
  })

  test('report error when datetime is not before or equal to the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().toISO()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        beforeDate: DateTime.local().minus({ minutes: 30 }),
      }),
      mutate: () => {},
    }

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'published_at')
    assert.equal(errors.errors[0].rule, 'beforeOrEqual')
    assert.equal(errors.errors[0].message, 'beforeOrEqual date validation failed')
  })

  test('work fine when time is not defined for the same day', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().minus({ minutes: 5 }).toISODate()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        beforeDate: DateTime.local().minus({ minutes: 10 }),
      }),
      mutate: () => {},
    }

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when date is before or equal to the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().minus({ days: 11 }).toISODate()
    const publishedAtSameDate = DateTime.local().minus({ days: 10 }).toISODate()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        beforeDate: DateTime.local().minus({ days: 10 }),
      }),
      mutate: () => {},
    }

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAtSameDate!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when datetime is before or equal to the defined ref', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().minus({ minutes: 30 }).toISO()
    const publishedAtSameDateTime = DateTime.local().minus({ minutes: 10 }).toISO()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        beforeDate: DateTime.local().minus({ minutes: 10 }),
      }),
      mutate: () => {},
    }

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAtSameDateTime!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when time is not defined for the previous day', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publishedAt = DateTime.local().minus({ days: 1 }).toISODate()

    const validator = {
      errorReporter: reporter,
      field: 'published_at',
      pointer: 'published_at',
      tip: {},
      root: {},
      refs: schema.refs({
        beforeDate: DateTime.local().minus({ minutes: 10 }),
      }),
      mutate: () => {},
    }

    beforeOrEqual.validate(
      DateTime.fromISO(publishedAt!),
      compile(validator.refs.beforeDate).compiledOptions!,
      validator
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })
})

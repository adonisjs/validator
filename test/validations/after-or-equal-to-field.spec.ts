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
import { ParsedRule } from '@ioc:Adonis/Core/Validator'

import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { afterOrEqualToField } from '../../src/Validations/date/afterOrEqualToField'

function compile(field: string): ParsedRule<any> {
  return afterOrEqualToField.compile('literal', 'date', rules.afterField(field).options, {})
}

test.group('Date | After Or Equal To Field', () => {
  validate(
    afterOrEqualToField,
    test,
    DateTime.fromISO(DateTime.local().minus({ days: 1 }).toISODate()!),
    DateTime.fromISO(DateTime.local().toISODate()!),
    compile('start_date'),
    {
      tip: {
        start_date: DateTime.local().toISODate()!,
      },
    }
  )

  test('report error when date is not after or equal to defined field', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const endDate = DateTime.local().minus({ days: 1 }).toISODate()

    afterOrEqualToField.validate(
      DateTime.fromISO(endDate!),
      compile('start_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'end_date',
        pointer: 'end_date',
        tip: {
          start_date: DateTime.fromISO(DateTime.local().toISODate()!),
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'end_date')
    assert.equal(errors.errors[0].rule, 'afterOrEqualToField')
    assert.equal(errors.errors[0].message, 'after or equal to date validation failed')
  })

  test('work fine when value is after the defined field value', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const endDate = DateTime.local().plus({ days: 1 }).toISODate()

    afterOrEqualToField.validate(
      DateTime.fromISO(endDate!),
      compile('start_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'end_date',
        pointer: 'end_date',
        tip: {
          start_date: DateTime.local().toISODate()!,
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when value is equal the defined field value', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const endDate = DateTime.local().toISODate()

    afterOrEqualToField.validate(
      DateTime.fromISO(endDate!),
      compile('start_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'end_date',
        pointer: 'end_date',
        tip: {
          start_date: DateTime.local().toISODate()!,
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('raise error when comparison value cannot be converted to date time', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const endDate = DateTime.local().plus({ days: 1 }).toISODate()

    afterOrEqualToField.validate(
      DateTime.fromISO(endDate!),
      compile('start_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'end_date',
        pointer: 'end_date',
        tip: {
          start_date: 'hello world',
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'end_date')
    assert.equal(errors.errors[0].rule, 'afterOrEqualToField')
    assert.equal(errors.errors[0].message, 'after or equal to date validation failed')
  })

  test('skip validation when field value is not a datetime instance', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    afterOrEqualToField.validate('hello world', compile('start_date').compiledOptions!, {
      errorReporter: reporter,
      field: 'end_date',
      pointer: 'end_date',
      tip: {
        start_date: DateTime.fromISO(DateTime.local().toISODate()!),
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })
})

/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { ParsedRule } from '../../src/types.js'

import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { beforeOrEqualToField } from '../../src/validations/date/before_or_equal_to_field.js'

function compile(field: string): ParsedRule<any> {
  return beforeOrEqualToField.compile(
    'literal',
    'date',
    rules.beforeOrEqualToField(field).options,
    {}
  )
}

test.group('Date | Before Or Equal To Field', () => {
  validate(
    beforeOrEqualToField,
    test,
    DateTime.fromISO(DateTime.local().plus({ days: 1 }).toISODate()!),
    DateTime.fromISO(DateTime.local().toISODate()!),
    compile('end_date'),
    {
      tip: {
        end_date: DateTime.local().toISODate()!,
      },
    }
  )

  test('report error when date is not before or equal to defined field', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const startDate = DateTime.local().plus({ days: 1 }).toISODate()

    beforeOrEqualToField.validate(
      DateTime.fromISO(startDate!),
      compile('end_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'start_date',
        pointer: 'start_date',
        tip: {
          end_date: DateTime.fromISO(DateTime.local().toISODate()!),
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'start_date')
    assert.equal(errors.errors[0].rule, 'beforeOrEqualToField')
    assert.equal(errors.errors[0].message, 'before or equal to date validation failed')
  })

  test('work fine when value is before to the defined field value', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const startDate = DateTime.local().minus({ days: 1 }).toISODate()

    beforeOrEqualToField.validate(
      DateTime.fromISO(startDate!),
      compile('end_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'start_date',
        pointer: 'start_date',
        tip: {
          end_date: DateTime.local().toISODate()!,
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('work fine when value is equal to the defined field value', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const startDate = DateTime.local().toISODate()

    beforeOrEqualToField.validate(
      DateTime.fromISO(startDate!),
      compile('end_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'start_date',
        pointer: 'start_date',
        tip: {
          end_date: DateTime.local().toISODate()!,
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('skip validation when comparison field value is not a datetime instance', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const startDate = DateTime.local().plus({ days: 1 }).toISODate()

    beforeOrEqualToField.validate(
      DateTime.fromISO(startDate!),
      compile('end_date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'start_date',
        pointer: 'start_date',
        tip: {
          end_date: 'hello world',
        },
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'start_date')
    assert.equal(errors.errors[0].rule, 'beforeOrEqualToField')
    assert.equal(errors.errors[0].message, 'before or equal to date validation failed')
  })

  test('skip validation when field value is not a datetime instance', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    beforeOrEqualToField.validate('hello world', compile('end_date').compiledOptions!, {
      errorReporter: reporter,
      field: 'start_date',
      pointer: 'start_date',
      tip: {
        end_date: DateTime.fromISO(DateTime.local().toISODate()!),
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })
})

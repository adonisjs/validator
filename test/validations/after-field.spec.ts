/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { DateTime } from 'luxon'
import { ParsedRule } from '@ioc:Adonis/Core/Validator'

import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { afterField } from '../../src/Validations/date/afterField'

function compile(field: string): ParsedRule<any> {
  return afterField.compile('literal', 'date', rules.afterField(field).options, {})
}

test.group('Date | After Field', () => {
  validate(
    afterField,
    test,
    DateTime.fromISO(DateTime.local().toISODate()!),
    DateTime.fromISO(DateTime.local().plus({ days: 2 }).toISODate()!),
    compile('start_date'),
    {
      tip: {
        start_date: DateTime.local().toISODate()!,
      },
    }
  )

  test('report error when date is not after defined field', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const endDate = DateTime.local().toISODate()

    afterField.validate(DateTime.fromISO(endDate!), compile('start_date').compiledOptions!, {
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
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'end_date')
    assert.equal(errors.errors[0].rule, 'afterField')
    assert.equal(errors.errors[0].message, 'after date validation failed')
  })

  test('work fine when value is after the defined field value', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const endDate = DateTime.local().plus({ day: 1 }).toISODate()

    afterField.validate(DateTime.fromISO(endDate!), compile('start_date').compiledOptions!, {
      errorReporter: reporter,
      field: 'end_date',
      pointer: 'end_date',
      tip: {
        start_date: DateTime.local().toISODate()!,
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 0)
  })

  test('raise error when comparison value cannot be converted to date time', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const endDate = DateTime.local().plus({ day: 1 }).toISODate()

    afterField.validate(DateTime.fromISO(endDate!), compile('start_date').compiledOptions!, {
      errorReporter: reporter,
      field: 'end_date',
      pointer: 'end_date',
      tip: {
        start_date: 'hello world',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    const errors = reporter.toJSON()
    assert.lengthOf(errors.errors, 1)
    assert.equal(errors.errors[0].field, 'end_date')
    assert.equal(errors.errors[0].rule, 'afterField')
    assert.equal(errors.errors[0].message, 'after date validation failed')
  })

  test('skip validation when field value is not a datetime instance', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    afterField.validate('hello world', compile('start_date').compiledOptions!, {
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

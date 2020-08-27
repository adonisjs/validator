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
import { beforeField } from '../../src/Validations/date/beforeField'

function compile(field: string): ParsedRule<any> {
	return beforeField.compile('literal', 'date', rules.beforeField(field).options, {})
}

test.group('Date | Before Field', () => {
	validate(
		beforeField,
		test,
		DateTime.fromISO(DateTime.local().toISODate()!),
		DateTime.fromISO(DateTime.local().minus({ days: 2 }).toISODate()!),
		compile('end_date'),
		{
			tip: {
				end_date: DateTime.local().toISODate()!,
			},
		}
	)

	test('report error when date is not before defined field', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const startDate = DateTime.local().toISODate()

		beforeField.validate(DateTime.fromISO(startDate!), compile('end_date').compiledOptions!, {
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
		assert.lengthOf(errors.errors, 1)
		assert.equal(errors.errors[0].field, 'start_date')
		assert.equal(errors.errors[0].rule, 'beforeField')
		assert.equal(errors.errors[0].message, 'before date validation failed')
	})

	test('work fine when value is before the defined field value', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const startDate = DateTime.local().minus({ day: 1 }).toISODate()

		beforeField.validate(DateTime.fromISO(startDate!), compile('end_date').compiledOptions!, {
			errorReporter: reporter,
			field: 'start_date',
			pointer: 'start_date',
			tip: {
				end_date: DateTime.local().toISODate()!,
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
		const startDate = DateTime.local().plus({ day: 1 }).toISODate()

		beforeField.validate(DateTime.fromISO(startDate!), compile('end_date').compiledOptions!, {
			errorReporter: reporter,
			field: 'start_date',
			pointer: 'start_date',
			tip: {
				end_date: 'hello world',
			},
			root: {},
			refs: {},
			mutate: () => {},
		})

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 1)
		assert.equal(errors.errors[0].field, 'start_date')
		assert.equal(errors.errors[0].rule, 'beforeField')
		assert.equal(errors.errors[0].message, 'before date validation failed')
	})

	test('skip validation when field value is not a datetime instance', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)

		beforeField.validate('hello world', compile('end_date').compiledOptions!, {
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

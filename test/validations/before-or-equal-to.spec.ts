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
import { SchemaRef, ParsedRule } from '@ioc:Adonis/Core/Validator'

import { rules } from '../../src/Rules'
import { schema } from '../../src/Schema'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { beforeOrEqualTo } from '../../src/Validations/date/beforeOrEqualTo'

function compile(date: SchemaRef<DateTime>): ParsedRule<any> {
	return beforeOrEqualTo.compile('literal', 'date', rules.beforeOrEqualTo(date).options, {})
}

test.group('Date | BeforeOrEqualTo | Ref', () => {
	test('report error when date is not before the defined ref', (assert) => {
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

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.beforeDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 1)
		assert.equal(errors.errors[0].field, 'published_at')
		assert.equal(errors.errors[0].rule, 'beforeOrEqualTo')
		assert.equal(errors.errors[0].message, 'before or equal to date validation failed')
	})

	test('report error when datetime is not before the defined ref', (assert) => {
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

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.beforeDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 1)
		assert.equal(errors.errors[0].field, 'published_at')
		assert.equal(errors.errors[0].rule, 'beforeOrEqualTo')
		assert.equal(errors.errors[0].message, 'before or equal to date validation failed')
	})

	test('work fine when time is not defined for the same day', (assert) => {
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

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.beforeDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})

	test('work fine when date is before the defined ref', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publishedAt = DateTime.local().minus({ days: 11 }).toISODate()

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

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.beforeDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})

	test('work fine when datetime is before the defined ref', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publishedAt = DateTime.local().minus({ minutes: 30 }).toISO()

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

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.beforeDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})

	test('work fine when time is not defined for the previous day', (assert) => {
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

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.beforeDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})

	test('work fine when time is not defined for the next day date case', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publishedAt = DateTime.local().startOf('day').toISODate()
		const validator = {
			errorReporter: reporter,
			field: 'published_at',
			pointer: 'published_at',
			tip: {},
			root: {},
			refs: schema.refs({
				afterDate: DateTime.local().startOf('day'),
			}),
			mutate: () => {},
		}

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})

	test('work fine when time is not defined for the next day datetime case', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publishedAt = DateTime.local().startOf('day').toISO()
		const validator = {
			errorReporter: reporter,
			field: 'published_at',
			pointer: 'published_at',
			tip: {},
			root: {},
			refs: schema.refs({
				afterDate: DateTime.local().startOf('day'),
			}),
			mutate: () => {},
		}

		beforeOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})
})

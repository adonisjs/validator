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
import { afterOrEqualTo } from '../../src/Validations/date/afterOrEqualTo'

function compile(date: SchemaRef<DateTime>): ParsedRule<any> {
	return afterOrEqualTo.compile('literal', 'date', rules.afterOrEqualTo(date).options, {})
}

test.group('Date | AfterOrEqualTo | Ref', () => {
	test('report error when date is before the defined ref', (assert) => {
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

		afterOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 1)
		assert.equal(errors.errors[0].field, 'published_at')
		assert.equal(errors.errors[0].rule, 'afterOrEqualTo')
		assert.equal(errors.errors[0].message, 'after or equal to date validation failed')
	})

	test('report error when datetime is before the defined ref', (assert) => {
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

		afterOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 1)
		assert.equal(errors.errors[0].field, 'published_at')
		assert.equal(errors.errors[0].rule, 'afterOrEqualTo')
		assert.equal(errors.errors[0].message, 'after or equal to date validation failed')
	})

	test('report error when time is not defined for the same day', (assert) => {
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

		afterOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 1)
		assert.equal(errors.errors[0].field, 'published_at')
		assert.equal(errors.errors[0].rule, 'afterOrEqualTo')
		assert.equal(errors.errors[0].message, 'after or equal to date validation failed')
	})

	test('work fine when date is after the defined ref', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publishedAt = DateTime.local().plus({ days: 11 }).toISODate()
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

		afterOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})

	test('work fine when datetime is after the defined ref', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publishedAt = DateTime.local().plus({ minutes: 30 }).toISO()
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

		afterOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})

	test('work fine when time is not defined for the next day', (assert) => {
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

		afterOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
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

		afterOrEqualTo.validate(
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

		afterOrEqualTo.validate(
			DateTime.fromISO(publishedAt!),
			compile(validator.refs.afterDate).compiledOptions!,
			validator
		)

		const errors = reporter.toJSON()
		assert.lengthOf(errors.errors, 0)
	})
})

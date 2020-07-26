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
import { NodeSubType } from '@ioc:Adonis/Core/Validator'

import { rules } from '../../src/Rules'
import { schema } from '../../src/Schema'
import { validate } from '../fixtures/rules/index'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { blacklist } from '../../src/Validations/miscellaneous/blacklist'

function compile(keywords: any, subtype?: NodeSubType) {
	return blacklist.compile('literal', subtype || 'string', rules.blacklist(keywords).options)
}

test.group('blacklist', () => {
	validate(blacklist, test, '1', '10', compile(['1', '2']))

	test('do not compile when keywords are not defined', (assert) => {
		const fn = () => blacklist.compile('literal', 'string')
		assert.throw(fn, '"blacklist": The 3rd argument must be a combined array of arguments')
	})

	test('do not compile when blacklist is not an array of values', (assert) => {
		const fn = () => blacklist.compile('literal', 'string', ['foo'])
		assert.throw(fn, '"blacklist": expects an array of "blacklist keywords" or a "ref"')
	})
})

test.group('blacklist | string', () => {
	test('report error when value is part of blacklist keywords', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		blacklist.validate('3', compile(['3', '4']).compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'points',
					rule: 'blacklist',
					args: { keywords: ['3', '4'] },
					message: 'blacklist validation failed',
				},
			],
		})
	})

	test('work fine when value is not part of blacklist', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		blacklist.validate('1', compile(['3', '4']).compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('skip when value is not a string', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		blacklist.validate(null, compile(['3', '4']).compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})
})

test.group('blacklist | number', () => {
	test('report error when value is part of blacklist keywords', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		blacklist.validate(3, compile([3, 4], 'number').compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'points',
					rule: 'blacklist',
					args: { keywords: [3, 4] },
					message: 'blacklist validation failed',
				},
			],
		})
	})

	test('work fine when value is not part of blacklist', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		blacklist.validate(1, compile([3, 4], 'number').compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('skip when value is not a number', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		blacklist.validate('foo', compile([3, 4], 'number').compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})
})

test.group('blacklist | date', () => {
	test('report error when value is part of blacklist keywords', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publicHolidays = ['2020-12-25', '2021-01-01']

		blacklist.validate(
			DateTime.fromISO('2020-12-25'),
			compile(publicHolidays, 'date').compiledOptions!,
			{
				errorReporter: reporter,
				field: 'points',
				pointer: 'points',
				tip: {},
				root: {},
				refs: {},
				mutate: () => {},
			}
		)

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'points',
					rule: 'blacklist',
					args: { keywords: ['2020-12-25', '2021-01-01'] },
					message: 'blacklist validation failed',
				},
			],
		})
	})

	test('work fine when value is not part of blacklist', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publicHolidays = ['2020-12-25', '2021-01-01']

		blacklist.validate(
			DateTime.fromISO('2020-12-24'),
			compile(publicHolidays, 'date').compiledOptions!,
			{
				errorReporter: reporter,
				field: 'points',
				pointer: 'points',
				tip: {},
				root: {},
				refs: {},
				mutate: () => {},
			}
		)

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('skip when value is not a date', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		const publicHolidays = ['2020-12-25', '2021-01-01']

		blacklist.validate('2020-12-25', compile(publicHolidays, 'date').compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})
})

test.group('blacklist | array', () => {
	test('report error when value is part of blacklist keywords', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)

		blacklist.validate(['1', '2', '3'], compile(['10', '3', '6'], 'array').compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'points',
					rule: 'blacklist',
					args: { keywords: ['10', '3', '6'] },
					message: 'blacklist validation failed',
				},
			],
		})
	})

	test('work fine when value is not part of blacklist keywords', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)

		blacklist.validate(['1', '2', '4'], compile(['10', '3', '6'], 'array').compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('skip when value is not an array', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)

		blacklist.validate('3', compile(['10', '3', '6'], 'array').compiledOptions!, {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})
})

test.group('blacklist | refs', () => {
	test('report error when value is part of blacklist keywords', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)

		const validator = {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: schema.refs({
				blacklistKeywords: ['3', '4'],
			}),
			mutate: () => {},
		}

		blacklist.validate('3', compile(validator.refs.blacklistKeywords).compiledOptions!, validator)

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'points',
					rule: 'blacklist',
					args: { keywords: ['3', '4'] },
					message: 'blacklist validation failed',
				},
			],
		})
	})

	test('work fine when value is not a part of blacklist keywords', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)

		const validator = {
			errorReporter: reporter,
			field: 'points',
			pointer: 'points',
			tip: {},
			root: {},
			refs: schema.refs({
				blacklistKeywords: ['3', '4'],
			}),
			mutate: () => {},
		}

		blacklist.validate('1', compile(validator.refs.blacklistKeywords).compiledOptions!, validator)
		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})
})

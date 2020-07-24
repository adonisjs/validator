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
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { requiredIfExistsAll } from '../../src/Validations/existence/requiredIfExistsAll'

function compile(fields: string[]) {
	return requiredIfExistsAll.compile('literal', 'string', rules.requiredIfExistsAll(fields).options)
}

test.group('Required If Exists All', () => {
	validate(requiredIfExistsAll, test, undefined, 'foo', compile(['type', 'id']), {
		tip: {
			type: 'twitter',
			id: 1,
		},
	})

	test('do not compile when args are not defined', (assert) => {
		const fn = () => requiredIfExistsAll.compile('literal', 'string')
		assert.throw(fn, 'requiredIfExistsAll: The 3rd argument must be a combined array of arguments')
	})

	test('do not compile when fields are not defined', (assert) => {
		const fn = () => requiredIfExistsAll.compile('literal', 'string', [])
		assert.throw(fn, 'requiredIfExistsAll: expects an array of "fields"')
	})

	test('do not compile when fields are not defined as string', (assert) => {
		const fn = () => requiredIfExistsAll.compile('literal', 'string', ['foo'])
		assert.throw(fn, 'requiredIfExistsAll: expects "fields" to be an array')
	})

	test('compile with options', (assert) => {
		assert.deepEqual(requiredIfExistsAll.compile('literal', 'string', [['foo']]), {
			allowUndefineds: true,
			async: false,
			name: 'requiredIfExistsAll',
			compiledOptions: { fields: ['foo'] },
		})
	})

	test('report error when expectation matches and field is null', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		requiredIfExistsAll.validate(null, compile(['type', 'user_id']).compiledOptions!, {
			errorReporter: reporter,
			field: 'profile_id',
			pointer: 'profile_id',
			tip: {
				user_id: 1,
				type: 'twitter',
			},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'profile_id',
					rule: 'requiredIfExistsAll',
					message: 'requiredIfExistsAll validation failed',
					args: {
						otherFields: ['type', 'user_id'],
					},
				},
			],
		})
	})

	test('report error when expectation matches and field is null', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		requiredIfExistsAll.validate(undefined, compile(['type', 'user_id']).compiledOptions!, {
			errorReporter: reporter,
			field: 'profile_id',
			pointer: 'profile_id',
			tip: {
				user_id: 1,
				type: 'twitter',
			},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'profile_id',
					rule: 'requiredIfExistsAll',
					message: 'requiredIfExistsAll validation failed',
					args: {
						otherFields: ['type', 'user_id'],
					},
				},
			],
		})
	})

	test('report error when expectation matches and field is empty string', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		requiredIfExistsAll.validate('', compile(['type', 'user_id']).compiledOptions!, {
			errorReporter: reporter,
			field: 'profile_id',
			pointer: 'profile_id',
			tip: {
				user_id: 1,
				type: 'twitter',
			},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'profile_id',
					rule: 'requiredIfExistsAll',
					message: 'requiredIfExistsAll validation failed',
					args: {
						otherFields: ['type', 'user_id'],
					},
				},
			],
		})
	})

	test('work fine when any of the target field is undefined', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		requiredIfExistsAll.validate('', compile(['type', 'user_id']).compiledOptions!, {
			errorReporter: reporter,
			field: 'profile_id',
			pointer: 'profile_id',
			tip: {
				user_id: 1,
			},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('work fine when any of target field is null or undefined', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		requiredIfExistsAll.validate('', compile(['type', 'user_id']).compiledOptions!, {
			errorReporter: reporter,
			field: 'profile_id',
			pointer: 'profile_id',
			tip: {
				user_id: null,
				type: 'twitter',
			},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('work fine when expectation matches and field has value', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		requiredIfExistsAll.validate('hello', compile(['type', 'user_id']).compiledOptions!, {
			errorReporter: reporter,
			field: 'profile_id',
			pointer: 'profile_id',
			tip: {
				type: 'twitter',
				user_id: 1,
			},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})
})

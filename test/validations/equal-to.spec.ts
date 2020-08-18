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
import { equalTo } from '../../src/Validations/string/equalTo'

function compile() {
	// Regex Example for tax id validation from Brazil
	return equalTo.compile('literal', 'string', rules.equalTo('foo').options)
}

test.group('EqualTo', () => {
	validate(equalTo, test, 'bar', 'foo', compile())

	test('compile equalTo rule', (assert) => {
		const { compiledOptions } = equalTo.compile('literal', 'string', rules.equalTo('foo').options)
		assert.deepEqual(compiledOptions, { fieldValue: 'foo' })
	})

	test('ignore validation when value is not a valid string', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		equalTo.validate(null, compile().compiledOptions, {
			errorReporter: reporter,
			field: 'username',
			pointer: 'username',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('report error when value fails the equalTo validation', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		equalTo.validate('bar', compile().compiledOptions, {
			errorReporter: reporter,
			field: 'username',
			pointer: 'username',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'username',
					rule: 'equalTo',
					message: 'equalTo validation failed',
				},
			],
		})
	})

	test('work fine when value passes the equalTo validation', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		equalTo.validate('foo', compile().compiledOptions, {
			errorReporter: reporter,
			field: 'username',
			pointer: 'username',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})
})

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
import { url } from '../../src/Validations/string/url'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { UrlRuleOptions } from '@ioc:Adonis/Core/Validator'

function compile(options?: UrlRuleOptions) {
	return url.compile('literal', 'string', rules.url(options).options, {})
}

test.group('Url', () => {
	validate(url, test, '9999', 'google.com', compile())

	test('ignore validation when value is not a valid string', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		url.validate(null, compile().compiledOptions, {
			errorReporter: reporter,
			field: 'website',
			pointer: 'website',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('report error when value fails the url validation', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		url.validate('foo', compile().compiledOptions, {
			errorReporter: reporter,
			field: 'website',
			pointer: 'website',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'website',
					rule: 'url',
					message: 'url validation failed',
				},
			],
		})
	})

	test('work fine when value passes the url validation', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		url.validate('google.com', compile().compiledOptions, {
			errorReporter: reporter,
			field: 'website',
			pointer: 'website',
			tip: {},
			root: {},
			refs: {},
			mutate: () => {},
		})

		assert.deepEqual(reporter.toJSON(), { errors: [] })
	})

	test('report error when url protocol is missing', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		url.validate(
			'google.com',
			compile({
				requireProtocol: true,
			}).compiledOptions,
			{
				errorReporter: reporter,
				field: 'website',
				pointer: 'website',
				tip: {},
				root: {},
				refs: {},
				mutate: () => {},
			}
		)

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'website',
					rule: 'url',
					message: 'url validation failed',
				},
			],
		})
	})

	test("report error when url protocol doesn't match", (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		url.validate(
			'http://google.com',
			compile({
				requireProtocol: true,
				protocols: ['https'],
			}).compiledOptions,
			{
				errorReporter: reporter,
				field: 'website',
				pointer: 'website',
				tip: {},
				root: {},
				refs: {},
				mutate: () => {},
			}
		)

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'website',
					rule: 'url',
					message: 'url validation failed',
				},
			],
		})
	})

	test('report error when url hostname is not part of whitelist', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		url.validate(
			'http://google.com',
			compile({
				requireProtocol: true,
				hostWhitelist: ['twitter.com'],
			}).compiledOptions,
			{
				errorReporter: reporter,
				field: 'website',
				pointer: 'website',
				tip: {},
				root: {},
				refs: {},
				mutate: () => {},
			}
		)

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'website',
					rule: 'url',
					message: 'url validation failed',
				},
			],
		})
	})

	test('report error when url hostname is part of blacklist', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		url.validate(
			'http://twitter.com',
			compile({
				requireProtocol: true,
				hostBlacklist: ['twitter.com'],
			}).compiledOptions,
			{
				errorReporter: reporter,
				field: 'website',
				pointer: 'website',
				tip: {},
				root: {},
				refs: {},
				mutate: () => {},
			}
		)

		assert.deepEqual(reporter.toJSON(), {
			errors: [
				{
					field: 'website',
					rule: 'url',
					message: 'url validation failed',
				},
			],
		})
	})

	test('add protocol to the url if missing', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		let website = 'google.com'

		url.validate(website, compile({ ensureProtocol: true }).compiledOptions, {
			errorReporter: reporter,
			field: 'website',
			pointer: 'website',
			tip: {},
			root: {},
			refs: {},
			mutate: (newValue) => (website = newValue),
		})

		assert.equal(website, 'http://google.com')
	})

	test('ensure the given protocol', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		let website = 'google.com'

		url.validate(website, compile({ ensureProtocol: 'ftp' }).compiledOptions, {
			errorReporter: reporter,
			field: 'website',
			pointer: 'website',
			tip: {},
			root: {},
			refs: {},
			mutate: (newValue) => (website = newValue),
		})

		assert.equal(website, 'ftp://google.com')
	})

	test('strip www', (assert) => {
		const reporter = new ApiErrorReporter(new MessagesBag({}), false)
		let website = 'www.google.com'

		url.validate(website, compile({ stripWWW: true }).compiledOptions, {
			errorReporter: reporter,
			field: 'website',
			pointer: 'website',
			tip: {},
			root: {},
			refs: {},
			mutate: (newValue) => (website = newValue),
		})

		assert.equal(website, 'http://google.com')
	})
})

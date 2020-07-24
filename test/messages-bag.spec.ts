/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { MessagesBag } from '../src/MessagesBag'

test.group('Message Bag', () => {
	test('get message for a rule', (assert) => {
		const messages = new MessagesBag({
			required: 'Field is required',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field'),
			'Field is required'
		)
	})

	test('give preference to pointer.rule when defined', (assert) => {
		const messages = new MessagesBag({
			'required': 'Field is required',
			'username.required': 'Username is required',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field'),
			'Username is required'
		)
	})

	test('give preference to arrayExpression.rule when defined', (assert) => {
		const messages = new MessagesBag({
			'required': 'Field is required',
			'users.*.username.required': 'Username is required',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field', 'users.*.username'),
			'Username is required'
		)
	})

	test('return default message when no messages are defined', (assert) => {
		const messages = new MessagesBag({})

		assert.equal(
			messages.get('username', 'required', 'required validation field', 'users.*.username'),
			'required validation field'
		)
	})

	test('replace field placeholder with the pointer', (assert) => {
		const messages = new MessagesBag({
			required: '{{ field }} is required',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field', 'users.*.username'),
			'username is required'
		)
	})

	test('replace rule placeholder with the pointer', (assert) => {
		const messages = new MessagesBag({
			required: '{{ field }} is {{ rule }}',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field', 'users.*.username'),
			'username is required'
		)
	})

	test('replace options placeholders', (assert) => {
		const messages = new MessagesBag({
			required: '{{ field }} is required when foo = {{ options.when.foo }}',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field', 'users.*.username', {
				when: {
					foo: 'bar',
				},
			}),
			'username is required when foo = bar'
		)
	})

	test('invoke wildcard callback when no messages are defined', (assert) => {
		const messages = new MessagesBag({
			'*': () => 'Validation failed',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field', 'users.*.username'),
			'Validation failed'
		)
	})

	test('do not invoke wildcard callback when message for the pointer is defined', (assert) => {
		const messages = new MessagesBag({
			'*': () => 'Validation failed',
			'username.required': 'username is required',
		})

		assert.equal(
			messages.get('username', 'required', 'required validation field', 'users.*.username'),
			'username is required'
		)
	})
})

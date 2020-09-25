/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'

import { Request } from '@adonisjs/http-server/build/standalone'
import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'

import { schema } from '../src/Schema'
import { validator } from '../src/Validator'
import { setupApp, fs } from '../test-helpers'
import extendRequest from '../src/Bindings/Request'

test.group('Request validator', (group) => {
	group.before(() => {
		extendRequest((Request as unknown) as RequestConstructorContract, validator.validate)
	})

	group.afterEach(async () => {
		await fs.cleanup()
	})

	test('choose api reporter when accept header is application/json', async (assert) => {
		assert.plan(1)

		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})

		ctx.request.request.headers.accept = 'application/json'
		ctx.request.allFiles = function () {
			return {}
		}

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})
		}

		try {
			await ctx.request.validate(Validator)
		} catch (error) {
			assert.deepEqual(error.messages, {
				errors: [
					{
						rule: 'required',
						message: 'required validation failed',
						field: 'username',
					},
				],
			})
		}
	})

	test('choose jsonapi reporter when accept header is application/vnd.api+json', async (assert) => {
		assert.plan(1)

		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})

		ctx.request.request.headers.accept = 'application/vnd.api+json'
		ctx.request.allFiles = function () {
			return {}
		}

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})
		}

		try {
			await ctx.request.validate(Validator)
		} catch (error) {
			assert.deepEqual(error.messages, {
				errors: [
					{
						code: 'required',
						title: 'required validation failed',
						source: {
							pointer: 'username',
						},
					},
				],
			})
		}
	})

	test('choose vanilla reporter when no accept header is set', async (assert) => {
		assert.plan(2)

		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})

		ctx.request.allFiles = function () {
			return {}
		}

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})
		}

		try {
			await ctx.request.validate(Validator)
		} catch (error) {
			assert.equal(error.flashToSession, true)
			assert.deepEqual(error.messages, {
				username: ['required validation failed'],
			})
		}
	})

	test('choose json reporter when its an ajax request', async (assert) => {
		assert.plan(2)

		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})
		ctx.request.request.headers['x-requested-with'] = 'XMLHttpRequest'

		ctx.request.allFiles = function () {
			return {}
		}

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})
		}

		try {
			await ctx.request.validate(Validator)
		} catch (error) {
			assert.equal(error.flashToSession, false)
			assert.deepEqual(error.messages, {
				errors: [
					{
						message: 'required validation failed',
						rule: 'required',
						field: 'username',
					},
				],
			})
		}
	})

	test('choose vanilla reporter when X-Inertia header is set', async (assert) => {
		assert.plan(2)

		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})
		ctx.request.request.headers.accept = 'application/json'
		ctx.request.request.headers['x-inertia'] = 'true'
		ctx.request.request.headers['x-requested-with'] = 'XMLHttpRequest'

		ctx.request.allFiles = function () {
			return {}
		}

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})
		}

		try {
			await ctx.request.validate(Validator)
		} catch (error) {
			assert.equal(error.flashToSession, true)
			assert.deepEqual(error.messages, {
				username: ['required validation failed'],
			})
		}
	})

	test('profile using the profiler', async (assert) => {
		assert.plan(2)

		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})

		app.container.use('Adonis/Core/Profiler').process((packet: any) => {
			if (packet.type === 'action') {
				assert.deepEqual(packet.data, { status: 'error' })
				assert.equal(packet.label, 'request:validate')
			}
		})

		ctx.request.allFiles = function () {
			return {}
		}

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})
		}

		try {
			await ctx.request.validate(Validator)
		} catch {}
	})

	test('return validated request body', async (assert) => {
		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})

		ctx.request.request.headers.accept = 'application/json'
		ctx.request.allFiles = function () {
			return {}
		}
		ctx.request.setInitialBody({ username: 'virk', age: 22 })

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})
		}

		const validated = await ctx.request.validate(Validator)
		assert.deepEqual(validated, { username: 'virk' })
	})

	test('provide custom data', async (assert) => {
		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})
		ctx.request.request.headers.accept = 'application/json'
		ctx.request.allFiles = function () {
			return {}
		}

		class Validator {
			public schema = schema.create({
				username: schema.string(),
			})

			public data = { username: 'virk' }
		}

		const validated = await ctx.request.validate(Validator)
		assert.deepEqual(validated, { username: 'virk' })
	})

	test('validate using vanilla object', async (assert) => {
		const app = await setupApp()
		const ctx = app.container.use('Adonis/Core/HttpContext').create('/', {})

		ctx.request.request.headers.accept = 'application/json'
		ctx.request.allFiles = function () {
			return {}
		}
		ctx.request.setInitialBody({ username: 'virk', age: 22 })

		const validated = await ctx.request.validate({
			schema: schema.create({
				username: schema.string(),
			}),
		})
		assert.deepEqual(validated, { username: 'virk' })
	})
})

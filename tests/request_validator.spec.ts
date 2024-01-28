/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import { BodyParserMiddlewareFactory } from '@adonisjs/core/factories/bodyparser'

import '../src/bindings/request.js'
import { schema } from '../src/schema/index.js'
import { validator } from '../src/validator/index.js'
import { ApiErrorReporter, VanillaErrorReporter } from '../src/error_reporter/index.js'

test.group('Request validator', (group) => {
  group.each.teardown(async () => {
    /**
     * reset config
     */
    validator.configure({
      bail: false,
      existsStrict: false,
      reporter: VanillaErrorReporter,
    })
  })

  test('choose api reporter when accept header is application/json', async ({ assert }) => {
    assert.plan(1)

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    ctx.request.request.headers.accept = 'application/json'

    class Validator {
      schema = schema.create({
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

  test('choose jsonapi reporter when accept header is application/vnd.api+json', async ({
    assert,
  }) => {
    assert.plan(1)

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    ctx.request.request.headers.accept = 'application/vnd.api+json'

    class Validator {
      schema = schema.create({
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

  test('choose vanilla reporter when no accept header is set', async ({ assert }) => {
    assert.plan(2)

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    class Validator {
      schema = schema.create({
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

  test('choose json reporter when its an ajax request', async ({ assert }) => {
    assert.plan(2)

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    ctx.request.request.headers['x-requested-with'] = 'XMLHttpRequest'

    class Validator {
      schema = schema.create({
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

  test('return validated request body', async ({ assert }) => {
    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    ctx.request.request.headers.accept = 'application/json'
    ctx.request.setInitialBody({ username: 'virk', age: 22 })

    class Validator {
      schema = schema.create({
        username: schema.string(),
      })
    }

    const validated = await ctx.request.validate(Validator)
    assert.deepEqual(validated, { username: 'virk' })
  })

  test('provide custom data', async ({ assert }) => {
    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    ctx.request.request.headers.accept = 'application/json'

    class Validator {
      schema = schema.create({
        username: schema.string(),
      })

      data = { username: 'virk' }
    }

    const validated = await ctx.request.validate(Validator)
    assert.deepEqual(validated, { username: 'virk' })
  })

  test('validate using vanilla object', async ({ assert }) => {
    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    ctx.request.request.headers.accept = 'application/json'
    ctx.request.setInitialBody({ username: 'virk', age: 22 })

    const validated = await ctx.request.validate({
      schema: schema.create({
        username: schema.string(),
      }),
    })
    assert.deepEqual(validated, { username: 'virk' })
  })

  test('use requestReporter from config when defined', async ({ assert }) => {
    assert.plan(1)
    validator.negotiator(() => ApiErrorReporter)

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    class Validator {
      schema = schema.create({
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

  test('use inline validator reporter over requestReporter', async ({ assert }) => {
    assert.plan(1)
    validator.negotiator(() => ApiErrorReporter)

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    class Validator {
      schema = schema.create({
        username: schema.string(),
      })
      reporter = VanillaErrorReporter
    }

    try {
      await ctx.request.validate(Validator)
    } catch (error) {
      assert.deepEqual(error.messages, {
        username: ['required validation failed'],
      })
    }
  })

  test('use default messages', async ({ assert }) => {
    assert.plan(1)
    validator.messages(() => {
      return {
        required: 'field is required',
      }
    })

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    class Validator {
      schema = schema.create({
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
            message: 'field is required',
            field: 'username',
          },
        ],
      })
    }
  })

  test('give priority to inline messages when defined', async ({ assert }) => {
    assert.plan(1)
    validator.messages(() => {
      return {
        required: 'field is required',
      }
    })

    const ctx = new HttpContextFactory().create()
    const bodyParser = new BodyParserMiddlewareFactory().create()
    await bodyParser.handle(ctx, () => {})

    class Validator {
      schema = schema.create({
        username: schema.string(),
      })

      messages = {
        required: 'username is required',
      }
    }

    try {
      await ctx.request.validate(Validator)
    } catch (error) {
      assert.deepEqual(error.messages, {
        errors: [
          {
            rule: 'required',
            message: 'username is required',
            field: 'username',
          },
        ],
      })
    }
  })
})

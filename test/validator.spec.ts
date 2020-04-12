/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { FakeLogger } from '@adonisjs/logger/build/standalone'
import { validator as validatorType } from '@ioc:Adonis/Core/Validator'

import { rules } from '../src/Rules'
import { schema } from '../src/Schema'
import { getLiteralType } from '../src/utils'
import * as validations from '../src/Validations'
import { validator as validatorBase } from '../src/Validator'
import { ApiErrorReporter } from '../src/ErrorReporter'

const validator = validatorBase as unknown as typeof validatorType

test.group('Validator | validate', () => {
  test('validate schema object against runtime data', async (assert) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
        })),
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, { username: ['required validation failed'] })
    }
  })

  test('collect all errors', async (assert) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        })),
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        username: ['required validation failed'],
        email: ['required validation failed'],
        password: ['required validation failed'],
      })
    }
  })

  test('stop at first error when bail is true', async (assert) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        })),
        data: {},
        bail: true,
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        username: ['required validation failed'],
      })
    }
  })

  test('use custom messages when defined', async (assert) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        })),
        data: {},
        messages: {
          required: 'The field is required',
        },
        bail: true,
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        username: ['The field is required'],
      })
    }
  })

  test('use custom error reporter when defined', async (assert) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        })),
        data: {},
        messages: { required: 'The field is required' },
        bail: true,
        reporter: ApiErrorReporter,
      })
    } catch (error) {
      assert.deepEqual(error.messages, [{
        rule: 'required',
        field: 'username',
        message: 'The field is required',
      }])
    }
  })
})

test.group('Validator | addRule', () => {
  test('add a custom rule', (assert) => {
    validator.addRule('isPhone', {
      validate () {
      },
      compile () {
        return {
          async: false,
          allowUndefineds: true,
          name: 'isPhone',
          compiledOptions: undefined,
        }
      },
    })

    assert.property(validations, 'isPhone')
    assert.property(rules, 'isPhone')
    assert.deepEqual(rules['isPhone'](), { name: 'isPhone', options: [] })
    assert.deepEqual(rules['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
    assert.deepEqual(validations['isPhone'].compile(), {
      async: false,
      allowUndefineds: true,
      name: 'isPhone',
      compiledOptions: undefined,
    })
  })
})

test.group('Validator | addType', () => {
  test('add a custom type', (assert) => {
    function unicorn () {
      return getLiteralType('unicorn', false, {}, [])
    }
    validator.addRule('unicorn', {
      compile () {
        return {
          async: false,
          allowUndefineds: false,
          name: 'unicorn',
          compiledOptions: undefined,
        }
      },
      validate () {},
    })
    validator.addType('unicorn', unicorn)

    assert.property(schema, 'file')
    const parsed = schema.create({
      avatar: schema['unicorn'](),
    })

    assert.deepEqual(parsed.tree, {
      avatar: {
        type: 'literal' as const,
        subtype: 'unicorn',
        rules: [
          {
            name: 'required',
            async: false,
            allowUndefineds: true,
            compiledOptions: undefined,
          },
          {
            name: 'unicorn',
            async: false,
            allowUndefineds: false,
            compiledOptions: undefined,
          },
        ],
      },
    })
  })
})

test.group('Validator | configure', () => {
  test('use custom logger', async (assert) => {
    assert.plan(1)

    const logger = new FakeLogger({ name: 'adonisjs', enabled: true, level: 'trace' })
    validator['configure']({
      logger,
    })
    validator.compileAndCache(schema.create({}), '/posts')
    assert.equal(logger.logs[0].msg, 'Compiling schema for "/posts" cache key')
  })
})

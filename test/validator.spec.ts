/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { validator as validatorType } from '@ioc:Adonis/Core/Validator'

import { rules } from '../src/Rules'
import { schema } from '../src/Schema'
import { getLiteralType } from '../src/utils'
import * as validations from '../src/Validations'
import { ApiErrorReporter } from '../src/ErrorReporter'
import { validator as validatorBase } from '../src/Validator'

const validator = validatorBase as unknown as typeof validatorType

test.group('Validator | validate', () => {
  test('validate schema object against runtime data', async (assert) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          username: schema.string(),
        }),
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
        schema: schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        }),
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
        schema: schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        }),
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
        schema: schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        }),
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
        schema: schema.create({
          username: schema.string(),
          email: schema.string(),
          password: schema.string(),
        }),
        data: {},
        messages: { required: 'The field is required' },
        bail: true,
        reporter: ApiErrorReporter,
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        errors: [{
          rule: 'required',
          field: 'username',
          message: 'The field is required',
        }],
      })
    }
  })

  test('cache schema using the cache key', async () => {
    const initialSchema = schema.create({
      username: schema.string.optional(),
    })

    /**
     * First validation will be skipped, since we have marked
     * the field optional
     */
    await validator.validate({
      schema: initialSchema,
      data: {},
      cacheKey: 'foo',
      reporter: ApiErrorReporter,
    })

    const newSchema = schema.create({
      username: schema.string(),
    })

    /**
     * This one should have failed, but not, since the same
     * cache key is used and hence new schema is not
     * compiled
     */
    await validator.validate({
      schema: newSchema,
      data: {},
      cacheKey: 'foo',
      reporter: ApiErrorReporter,
    })
  })
})

test.group('Validator | rule', () => {
  test('add a custom rule', (assert) => {
    validator.rule('isPhone', () => {})

    assert.property(validations, 'isPhone')
    assert.property(rules, 'isPhone')
    assert.deepEqual(rules['isPhone'](), { name: 'isPhone', options: [] })
    assert.deepEqual(rules['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
    assert.deepEqual(validations['isPhone'].compile('literal', 'string', []), {
      async: false,
      allowUndefineds: false,
      name: 'isPhone',
      compiledOptions: [],
    })
  })

  test('set allowUndefineds to true', (assert) => {
    validator.rule('isPhone', () => {}, () => {
      return {
        allowUndefineds: true,
      }
    })

    assert.property(validations, 'isPhone')
    assert.property(rules, 'isPhone')
    assert.deepEqual(rules['isPhone'](), { name: 'isPhone', options: [] })
    assert.deepEqual(rules['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
    assert.deepEqual(validations['isPhone'].compile('literal', 'string', []), {
      async: false,
      allowUndefineds: true,
      name: 'isPhone',
      compiledOptions: [],
    })
  })

  test('return custom options', (assert) => {
    validator.rule(
      'isPhone',
      () => {},
      (options) => {
        assert.isArray(options)
        return {
          compiledOptions: { foo: 'bar' },
        }
      })

    assert.property(validations, 'isPhone')
    assert.property(rules, 'isPhone')
    assert.deepEqual(rules['isPhone'](), { name: 'isPhone', options: [] })
    assert.deepEqual(rules['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
    assert.deepEqual(validations['isPhone'].compile('literal', 'string', []), {
      async: false,
      allowUndefineds: false,
      name: 'isPhone',
      compiledOptions: { foo: 'bar' },
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
            compiledOptions: [],
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

test.group('Validator | validations with non-serialized options', () => {
  test('validate against a regex', async (assert) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          username: schema.string({}, [rules.regex(/[a-z]/)]),
        }),
        data: {
          username: '12',
        },
      })
    } catch (error) {
      assert.deepEqual(error.messages, { username: ['regex validation failed'] })
    }
  })
})

/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { DateTime } from 'luxon'

import { rules } from '../src/rules/index.js'
import { schema } from '../src/schema/index.js'
import { getLiteralType } from '../src/utils.js'
import { validator } from '../src/validator/index.js'
import validations from '../src/validations/index.js'
import { ApiErrorReporter, VanillaErrorReporter } from '../src/error_reporter/index.js'

test.group('Validator | validate', () => {
  test('validate schema object against runtime data', async ({ assert }) => {
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

  test('collect all errors', async ({ assert }) => {
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

  test('stop at first error when bail is true', async ({ assert }) => {
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

  test('use custom messages when defined', async ({ assert }) => {
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

  test('use custom error reporter when defined', async ({ assert }) => {
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
        errors: [
          {
            rule: 'required',
            field: 'username',
            message: 'The field is required',
          },
        ],
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

  test('assign value to a nullable field using rule', async ({ assert }) => {
    assert.plan(1)

    validator.rule(
      'default',
      (_, { defaultValue }, runtimeOptions) => {
        runtimeOptions.mutate(defaultValue)
      },
      ([defaultValue]) => {
        return {
          allowUndefineds: true,
          compiledOptions: {
            defaultValue,
          },
        }
      }
    )

    const { username } = await validator.validate({
      schema: schema.create({
        username: schema.string.nullable([{ name: 'default', options: ['virk'] }]),
      }),
      data: {
        username: null,
      },
    })

    assert.equal(username, 'virk')
  })

  test('assign value to an undefined field using rule', async ({ assert }) => {
    assert.plan(1)

    validator.rule(
      'default',
      (_, { defaultValue }, runtimeOptions) => {
        runtimeOptions.mutate(defaultValue)
      },
      ([defaultValue]) => {
        return {
          allowUndefineds: true,
          compiledOptions: {
            defaultValue,
          },
        }
      }
    )

    const { username } = await validator.validate({
      schema: schema.create({
        username: schema.string.optional([{ name: 'default', options: ['virk'] }]),
      }),
      data: {},
    })

    assert.equal(username, 'virk')
  })
})

test.group('Validator | validate object', () => {
  test('do not fail when value is undefined and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.optional().members({
          username: schema.string(),
        }),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })

  test('do not fail when value is null and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.optional().members({
          username: schema.string(),
        }),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data as any, {})
  })

  test('fail when value is undefined and nullable', async ({ assert }) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          user: schema.object.nullable().members({
            username: schema.string(),
          }),
        }),
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        user: ['nullable validation failed'],
      })
    }
  })

  test('do not fail when value is null and nullable', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.nullable().members({
          username: schema.string(),
        }),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is null and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.nullableAndOptional().members({
          username: schema.string(),
        }),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is undefined and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.nullableAndOptional().members({
          username: schema.string(),
        }),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })

  test('ignore object properties when not defined inside the schema', async ({ assert }) => {
    const output = await validator.validate({
      schema: schema.create({
        profile: schema.object().members({}),
      }),
      data: {
        profile: {
          username: 'virk',
          age: 30,
        },
      },
    })

    assert.deepEqual(output, { profile: {} })
  })
})

test.group('Validator | validate object | anyMembers', () => {
  test('do not fail when value is undefined and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.optional().anyMembers(),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })

  test('do not fail when value is null and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.optional().anyMembers(),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data as any, {})
  })

  test('fail when value is undefined and nullable', async ({ assert }) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          user: schema.object.nullable().anyMembers(),
        }),
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        user: ['nullable validation failed'],
      })
    }
  })

  test('do not fail when value is null and nullable', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.nullable().anyMembers(),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is null and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.nullableAndOptional().anyMembers(),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is undefined and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.object.nullableAndOptional().anyMembers(),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })

  test('return object by reference when anyMembers are allowed', async ({ assert }) => {
    assert.plan(1)

    const output = await validator.validate({
      schema: schema.create({
        profile: schema.object().anyMembers(),
      }),
      data: {
        profile: {
          username: 'virk',
          age: 30,
        },
      },
    })

    assert.deepEqual(output, { profile: { username: 'virk', age: 30 } })
  })
})

test.group('Validator | validate array', () => {
  test('do not fail when value is undefined and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.optional().members(schema.string()),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })

  test('do not fail when value is null and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.optional().members(schema.string()),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data as any, {})
  })

  test('fail when value is undefined and nullable', async ({ assert }) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          user: schema.array.nullable().members(schema.string()),
        }),
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        user: ['nullable validation failed'],
      })
    }
  })

  test('do not fail when value is null and nullable', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.nullable().members(schema.string()),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is null and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.nullableAndOptional().members(schema.string()),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is undefined and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.nullableAndOptional().members(schema.string()),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })
})

test.group('Validator | validate array | anyMembers', () => {
  test('do not fail when value is undefined and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.optional().anyMembers(),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })

  test('do not fail when value is null and optional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.optional().anyMembers(),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data as any, {})
  })

  test('fail when value is undefined and nullable', async ({ assert }) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          user: schema.array.nullable().anyMembers(),
        }),
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        user: ['nullable validation failed'],
      })
    }
  })

  test('do not fail when value is null and nullable', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.nullable().anyMembers(),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is null and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.nullableAndOptional().anyMembers(),
      }),
      data: {
        user: null,
      },
    })

    assert.deepEqual(data, { user: null })
  })

  test('do not fail when value is undefined and nullableAndOptional', async ({ assert }) => {
    const data = await validator.validate({
      schema: schema.create({
        user: schema.array.nullableAndOptional().anyMembers(),
      }),
      data: {},
    })

    assert.deepEqual(data as any, {})
  })

  test('pass array by reference', async ({ assert }) => {
    assert.plan(1)

    const output = await validator.validate({
      schema: schema.create({
        profiles: schema.array().anyMembers(),
      }),
      data: {
        profiles: [
          {
            username: 'virk',
            age: 30,
          },
        ],
      },
    })

    assert.deepEqual(output, { profiles: [{ username: 'virk', age: 30 }] })
  })
})

test.group('Validator | rule', () => {
  test('add a custom rule', ({ assert }) => {
    validator.rule('isPhone', () => {})

    assert.property(validations, 'isPhone')
    assert.property(rules, 'isPhone')
    assert.deepEqual((rules as any)['isPhone'](), { name: 'isPhone', options: [] })
    assert.deepEqual((rules as any)['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
    assert.deepEqual((validations as any)['isPhone'].compile('literal', 'string', []), {
      async: false,
      allowUndefineds: false,
      name: 'isPhone',
      compiledOptions: [],
    })
  })

  test('rule recieves correct arguments', async ({ assert }) => {
    assert.plan(14)

    const name = 'testArguments'

    const refs = schema.refs({
      username: 'ruby',
    })

    const options = [
      {
        operator: '=',
      },
    ]

    const data = {
      users: ['virk'],
    }

    validator.rule(
      name,
      (value, compiledOptions, runtimeOptions) => {
        assert.equal(value, 'virk')
        assert.deepEqual(compiledOptions, options)
        assert.onlyProperties(runtimeOptions, [
          'root',
          'tip',
          'field',
          'pointer',
          'arrayExpressionPointer',
          'refs',
          'errorReporter',
          'mutate',
        ])
        assert.deepEqual(runtimeOptions.root, data)
        assert.deepEqual(runtimeOptions.tip, ['virk'])
        assert.equal(runtimeOptions.field, '0')
        assert.equal(runtimeOptions.pointer, 'users.0')
        assert.equal(runtimeOptions.arrayExpressionPointer, 'users.*')
        assert.deepEqual(runtimeOptions.refs, refs)
        assert.instanceOf(runtimeOptions.errorReporter, ApiErrorReporter)
        assert.isFunction(runtimeOptions.mutate)
      },
      (opts, type, subtype) => {
        assert.deepEqual(opts, options)
        assert.equal(type, 'literal')
        assert.equal(subtype, 'string')
        return {}
      }
    )

    await validator.validate({
      refs,
      schema: schema.create({
        users: schema.array().members(schema.string({}, [{ name, options }])),
      }),
      data,
      reporter: ApiErrorReporter,
    })
  })

  test('set allowUndefineds to true', ({ assert }) => {
    validator.rule(
      'isPhone',
      () => {},
      () => {
        return {
          allowUndefineds: true,
        }
      }
    )

    assert.property(validations, 'isPhone')
    assert.property(rules, 'isPhone')
    assert.deepEqual((rules as any)['isPhone'](), { name: 'isPhone', options: [] })
    assert.deepEqual((rules as any)['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
    assert.deepEqual((validations as any)['isPhone'].compile('literal', 'string', []), {
      async: false,
      allowUndefineds: true,
      name: 'isPhone',
      compiledOptions: [],
    })
  })

  test('return custom options', ({ assert }) => {
    validator.rule(
      'isPhone',
      () => {},
      (options) => {
        assert.isArray(options)
        return {
          compiledOptions: { foo: 'bar' },
        }
      }
    )

    assert.property(validations, 'isPhone')
    assert.property(rules, 'isPhone')
    assert.deepEqual((rules as any)['isPhone'](), { name: 'isPhone', options: [] })
    assert.deepEqual((rules as any)['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
    assert.deepEqual((validations as any)['isPhone'].compile('literal', 'string', []), {
      async: false,
      allowUndefineds: false,
      name: 'isPhone',
      compiledOptions: { foo: 'bar' },
    })
  })
})

test.group('Validator | addType', () => {
  test('add a custom type', ({ assert }) => {
    function unicorn() {
      return getLiteralType('unicorn' as unknown as any, false, false, {}, [])
    }
    validator.rule(
      'unicorn',
      () => {},
      () => {
        return {}
      }
    )

    validator.type('unicorn', unicorn)

    assert.property(schema, 'file')
    const parsed = schema.create({
      avatar: (schema as any)['unicorn'](),
    })

    assert.deepEqual(parsed.tree, {
      avatar: {
        type: 'literal' as const,
        nullable: false,
        optional: false,
        subtype: 'unicorn',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
            compiledOptions: [],
          },
          {
            name: 'unicorn',
            async: false,
            allowUndefineds: false,
            compiledOptions: [{}],
          },
        ],
      },
    })
  })
})

test.group('Validator | validations with non-serialized options', () => {
  test('validate against a regex', async ({ assert }) => {
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

test.group('After Before Field', () => {
  test('fail when value is not after the defined field value', async ({ assert }) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          after: schema.date({}, [rules.afterField('before')]),
          before: schema.date({}),
        }),
        data: {
          before: '2020-10-20',
          after: '2020-10-19',
        },
      })
    } catch (error) {
      assert.deepEqual(error.messages, { after: ['after date validation failed'] })
    }
  })

  test('pass when value is after the defined field value', async ({ assert }) => {
    const { before, after } = await validator.validate({
      schema: schema.create({
        after: schema.date({}, [rules.afterField('before')]),
        before: schema.date({}),
      }),
      data: {
        before: '2020-10-20',
        after: '2020-10-22',
      },
    })

    assert.instanceOf(before, DateTime)
    assert.instanceOf(after, DateTime)
  })

  test('handle date formatting', async ({ assert }) => {
    const { before, after } = await validator.validate({
      schema: schema.create({
        after: schema.date({ format: 'LLLL dd yyyy' }, [rules.afterField('before')]),
        before: schema.date({ format: 'LLLL dd yyyy' }),
      }),
      data: {
        before: 'October 10 2020',
        after: 'October 12 2020',
      },
    })

    assert.instanceOf(before, DateTime)
    assert.instanceOf(after, DateTime)
  })

  test('handle use case when comparison field is not valid separately', async ({ assert }) => {
    const { after } = await validator.validate({
      schema: schema.create({
        after: schema.date({ format: 'LLLL dd yyyy' }, [rules.afterField('before')]),
      }),
      data: {
        before: 'October 10 2020',
        after: 'October 12 2020',
      },
    })

    assert.instanceOf(after, DateTime)
  })

  test('fail when format mis-match', async ({ assert }) => {
    assert.plan(1)

    try {
      await validator.validate({
        schema: schema.create({
          after: schema.date({ format: 'LLLL dd yyyy' }, [rules.afterField('before')]),
        }),
        data: {
          after: 'October 12 2020',
          before: '2020-10-10',
        },
      })
    } catch (error) {
      assert.deepEqual(error.messages, { after: ['after date validation failed'] })
    }
  })
})

test.group('Validator | options', (group) => {
  group.each.teardown(() => {
    /**
     * reset config
     */
    validator.configure({
      bail: false,
      existsStrict: false,
      reporter: VanillaErrorReporter,
    })
  })

  test('use options reporter when defined', async ({ assert }) => {
    assert.plan(1)
    validator.configure({ reporter: ApiErrorReporter })

    try {
      await validator.validate({
        schema: schema.create({
          username: schema.string(),
        }),
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        errors: [
          {
            message: 'required validation failed',
            field: 'username',
            rule: 'required',
          },
        ],
      })
    }
  })

  test('use inline reporter over config reporter', async ({ assert }) => {
    assert.plan(1)
    validator.configure({ reporter: ApiErrorReporter })

    try {
      await validator.validate({
        schema: schema.create({
          username: schema.string(),
        }),
        reporter: VanillaErrorReporter,
        data: {},
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        username: ['required validation failed'],
      })
    }
  })
})

test.group('Validator | validate string', () => {
  test('apply escape as a rule', async ({ assert }) => {
    assert.plan(1)

    const { username } = await validator.validate({
      schema: schema.create({
        username: schema.string([rules.escape()]),
      }),
      data: {
        username: '<p>virk</p>',
      },
    })

    assert.deepEqual(username, '&lt;p&gt;virk&lt;&#x2F;p&gt;')
  })

  test('apply trim as a rule', async ({ assert }) => {
    assert.plan(1)

    const { username } = await validator.validate({
      schema: schema.create({
        username: schema.string([rules.trim()]),
      }),
      data: {
        username: ' virk ',
      },
    })

    assert.deepEqual(username, 'virk')
  })
})

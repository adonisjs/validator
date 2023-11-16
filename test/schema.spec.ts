/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { rules } from '../src/Rules'
import { schema } from '../src/Schema'

test.group('Schema | String', () => {
  test('define schema with string rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.string(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'string',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
              compiledOptions: { escape: false, trim: false },
            },
          ],
        },
      }
    )
  })

  test('define schema with optional string rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.string.optional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'string',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
              compiledOptions: { escape: false, trim: false },
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable string rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.string.nullable(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'string',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
              compiledOptions: { escape: false, trim: false },
            },
          ],
        },
      }
    )
  })

  test('define schema with both nullable and optional string rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.string.nullableAndOptional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'string',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
              compiledOptions: { escape: false, trim: false },
            },
          ],
        },
      }
    )
  })

  test('define schema with string and custom rules', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.string({}, [rules.alpha()]),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'string',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
              compiledOptions: { escape: false, trim: false },
            },
            {
              name: 'alpha',
              allowUndefineds: false,
              async: false,
              compiledOptions: {
                pattern: '^[a-zA-Z]+$',
              },
            },
          ],
        },
      }
    )
  })

  test('define schema with escape rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.string({ escape: true }),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'string',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
              compiledOptions: { escape: true, trim: false },
            },
          ],
        },
      }
    )
  })

  test('turn on trim', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.string({ escape: true, trim: true }),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'string',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
              compiledOptions: { escape: true, trim: true },
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | Boolean', () => {
  test('define schema with boolean rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.boolean(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'boolean',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'boolean',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with optional boolean rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.boolean.optional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'boolean',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'boolean',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable boolean rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.boolean.nullable(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'boolean',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'boolean',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with both nullable and optional boolean rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.boolean.nullableAndOptional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'boolean',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'boolean',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | Number', () => {
  test('define schema with number rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.number(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'number',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'number',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with optional number rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.number.optional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'number',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'number',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable number rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.number.nullable(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'number',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'number',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with both optional and nullable number rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.number.nullableAndOptional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'number',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'number',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with number and custom rules', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.number([rules.unsigned()]),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'number',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'number',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'unsigned',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | BigInt', () => {
  test('define schema with bigint rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.bigint(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'bigint',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'bigint',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with optional bigint rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.bigint.optional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'bigint',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'bigint',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable bigint rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.bigint.nullable(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'bigint',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'bigint',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with both optional and nullable bigint rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.bigint.nullableAndOptional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'bigint',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'bigint',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | Date', () => {
  test('define schema with date rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.date(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'date',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'date',
              allowUndefineds: false,
              async: false,
              compiledOptions: {
                format: undefined,
                opts: undefined,
              },
            },
          ],
        },
      }
    )
  })

  test('define schema with optional date rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.date.optional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'date',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'date',
              allowUndefineds: false,
              async: false,
              compiledOptions: {
                format: undefined,
                opts: undefined,
              },
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable date rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.date.nullable(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'date',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'date',
              allowUndefineds: false,
              async: false,
              compiledOptions: {
                format: undefined,
                opts: undefined,
              },
            },
          ],
        },
      }
    )
  })

  test('define schema with both nullable and optional date rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.date.nullableAndOptional(),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'date',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'date',
              allowUndefineds: false,
              async: false,
              compiledOptions: {
                format: undefined,
                opts: undefined,
              },
            },
          ],
        },
      }
    )
  })

  test('define schema with date rule and options', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.date({ format: 'iso', opts: { zone: 'UTC-4' } }),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'date',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'date',
              allowUndefineds: false,
              async: false,
              compiledOptions: { format: 'iso', opts: { zone: 'UTC-4' } },
            },
          ],
        },
      }
    )
  })

  test('define schema with optional date rule and options', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.date.optional({ format: 'iso', opts: { zone: 'UTC-4' } }),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'date',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'date',
              allowUndefineds: false,
              async: false,
              compiledOptions: { format: 'iso', opts: { zone: 'UTC-4' } },
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | Enum', () => {
  test('define schema with enum rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enum(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enum',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'enum',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })

  test('define schema with optional enum rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enum.optional(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enum',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'enum',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable enum rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enum.nullable(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enum',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              compiledOptions: [],
              allowUndefineds: true,
              async: false,
            },
            {
              name: 'enum',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })

  test('define schema with both optional and nullable enum rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enum.nullableAndOptional(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enum',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'enum',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | Enum Set', () => {
  test('define schema with enumSet rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enumSet(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enumSet',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'enumSet',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })

  test('define schema with optional enumSet rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enumSet.optional(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enumSet',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'enumSet',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable enumSet rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enumSet.nullable(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enumSet',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              compiledOptions: [],
              allowUndefineds: true,
              async: false,
            },
            {
              name: 'enumSet',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })

  test('define schema with both optional and nullable enumSet rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        username: schema.enumSet.nullableAndOptional(['1', '2']),
      }).tree,
      {
        username: {
          type: 'literal',
          subtype: 'enumSet',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'enumSet',
              compiledOptions: { choices: ['1', '2'] },
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | Object', () => {
  test('define schema with object', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.object().members({
          username: schema.string(),
        }),
      }).tree,
      {
        profile: {
          type: 'object',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          children: {
            username: {
              type: 'literal',
              subtype: 'string',
              optional: false,
              nullable: false,
              rules: [
                {
                  name: 'required',
                  allowUndefineds: true,
                  async: false,
                  compiledOptions: [],
                },
                {
                  name: 'string',
                  allowUndefineds: false,
                  async: false,
                  compiledOptions: { escape: false, trim: false },
                },
              ],
            },
          },
        },
      }
    )
  })

  test('define schema with optional object', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.object.optional().members({
          username: schema.string(),
        }),
      }).tree,
      {
        profile: {
          type: 'object',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          children: {
            username: {
              type: 'literal',
              subtype: 'string',
              optional: false,
              nullable: false,
              rules: [
                {
                  name: 'required',
                  allowUndefineds: true,
                  async: false,
                  compiledOptions: [],
                },
                {
                  name: 'string',
                  allowUndefineds: false,
                  async: false,
                  compiledOptions: { escape: false, trim: false },
                },
              ],
            },
          },
        },
      }
    )
  })

  test('define schema with nullable object', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.object.nullable().members({
          username: schema.string(),
        }),
      }).tree,
      {
        profile: {
          type: 'object',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          children: {
            username: {
              type: 'literal',
              subtype: 'string',
              optional: false,
              nullable: false,
              rules: [
                {
                  name: 'required',
                  allowUndefineds: true,
                  async: false,
                  compiledOptions: [],
                },
                {
                  name: 'string',
                  allowUndefineds: false,
                  async: false,
                  compiledOptions: { escape: false, trim: false },
                },
              ],
            },
          },
        },
      }
    )
  })

  test('define schema with both optional and nullable object', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.object.nullableAndOptional().members({
          username: schema.string(),
        }),
      }).tree,
      {
        profile: {
          type: 'object',
          optional: true,
          nullable: true,
          rules: [
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          children: {
            username: {
              type: 'literal',
              subtype: 'string',
              optional: false,
              nullable: false,
              rules: [
                {
                  name: 'required',
                  allowUndefineds: true,
                  async: false,
                  compiledOptions: [],
                },
                {
                  name: 'string',
                  allowUndefineds: false,
                  async: false,
                  compiledOptions: { escape: false, trim: false },
                },
              ],
            },
          },
        },
      }
    )
  })

  test('define schema object with any members', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.object().anyMembers(),
      }).tree,
      {
        profile: {
          type: 'object',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })
})

test.group('Schema | Array', () => {
  test('define schema with array', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.array().members(
          schema.object().members({
            username: schema.string(),
          })
        ),
      }).tree,
      {
        profile: {
          type: 'array',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          each: {
            type: 'object',
            optional: false,
            nullable: false,
            rules: [
              {
                name: 'required',
                allowUndefineds: true,
                async: false,
                compiledOptions: [],
              },
              {
                name: 'object',
                allowUndefineds: false,
                async: false,
                compiledOptions: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                subtype: 'string',
                optional: false,
                nullable: false,
                rules: [
                  {
                    name: 'required',
                    allowUndefineds: true,
                    async: false,
                    compiledOptions: [],
                  },
                  {
                    name: 'string',
                    allowUndefineds: false,
                    async: false,
                    compiledOptions: { escape: false, trim: false },
                  },
                ],
              },
            },
          },
        },
      }
    )
  })

  test('define schema with optional array', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.array.optional().members(
          schema.object().members({
            username: schema.string(),
          })
        ),
      }).tree,
      {
        profile: {
          type: 'array',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          each: {
            type: 'object',
            optional: false,
            nullable: false,
            rules: [
              {
                name: 'required',
                allowUndefineds: true,
                async: false,
                compiledOptions: [],
              },
              {
                name: 'object',
                allowUndefineds: false,
                async: false,
                compiledOptions: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                subtype: 'string',
                optional: false,
                nullable: false,
                rules: [
                  {
                    name: 'required',
                    allowUndefineds: true,
                    async: false,
                    compiledOptions: [],
                  },
                  {
                    name: 'string',
                    allowUndefineds: false,
                    async: false,
                    compiledOptions: { escape: false, trim: false },
                  },
                ],
              },
            },
          },
        },
      }
    )
  })

  test('define schema with nullable array', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.array.nullable().members(
          schema.object().members({
            username: schema.string(),
          })
        ),
      }).tree,
      {
        profile: {
          type: 'array',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          each: {
            type: 'object',
            optional: false,
            nullable: false,
            rules: [
              {
                name: 'required',
                allowUndefineds: true,
                async: false,
                compiledOptions: [],
              },
              {
                name: 'object',
                allowUndefineds: false,
                async: false,
                compiledOptions: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                subtype: 'string',
                optional: false,
                nullable: false,
                rules: [
                  {
                    name: 'required',
                    allowUndefineds: true,
                    async: false,
                    compiledOptions: [],
                  },
                  {
                    name: 'string',
                    allowUndefineds: false,
                    async: false,
                    compiledOptions: { escape: false, trim: false },
                  },
                ],
              },
            },
          },
        },
      }
    )
  })

  test('define schema with array and custom rules', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.array([rules.maxLength(2)]).members(
          schema.object().members({
            username: schema.string(),
          })
        ),
      }).tree,
      {
        profile: {
          type: 'array',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'maxLength',
              compiledOptions: { maxLength: 2, subtype: 'array' },
              allowUndefineds: false,
              async: false,
            },
          ],
          each: {
            type: 'object',
            optional: false,
            nullable: false,
            rules: [
              {
                name: 'required',
                allowUndefineds: true,
                async: false,
                compiledOptions: [],
              },
              {
                name: 'object',
                allowUndefineds: false,
                async: false,
                compiledOptions: [],
              },
            ],
            children: {
              username: {
                type: 'literal',
                subtype: 'string',
                optional: false,
                nullable: false,
                rules: [
                  {
                    name: 'required',
                    allowUndefineds: true,
                    async: false,
                    compiledOptions: [],
                  },
                  {
                    name: 'string',
                    allowUndefineds: false,
                    async: false,
                    compiledOptions: { escape: false, trim: false },
                  },
                ],
              },
            },
          },
        },
      }
    )
  })

  test('define schema array with no members', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.array().anyMembers(),
      }).tree,
      {
        profile: {
          type: 'array',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema optional array with no members', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        profile: schema.array.optional().anyMembers(),
      }).tree,
      {
        profile: {
          type: 'array',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
        },
      }
    )
  })

  test('define schema with array of strings', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        scores: schema.array().members(schema.string()),
      }).tree,
      {
        scores: {
          type: 'array',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          each: {
            type: 'literal',
            subtype: 'string',
            optional: false,
            nullable: false,
            rules: [
              {
                name: 'required',
                allowUndefineds: true,
                async: false,
                compiledOptions: [],
              },
              {
                name: 'string',
                allowUndefineds: false,
                async: false,
                compiledOptions: { escape: false, trim: false },
              },
            ],
          },
        },
      }
    )
  })

  test('define schema with array of optional strings', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        scores: schema.array().members(schema.string.optional()),
      }).tree,
      {
        scores: {
          type: 'array',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'array',
              allowUndefineds: false,
              async: false,
              compiledOptions: [],
            },
          ],
          each: {
            type: 'literal',
            subtype: 'string',
            optional: true,
            nullable: false,
            rules: [
              {
                name: 'string',
                allowUndefineds: false,
                async: false,
                compiledOptions: { escape: false, trim: false },
              },
            ],
          },
        },
      }
    )
  })
})

test.group('Schema | File', () => {
  test('define schema with file rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        avatar: schema.file(),
      }).tree,
      {
        avatar: {
          type: 'literal',
          subtype: 'file',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'file',
              allowUndefineds: false,
              async: false,
              compiledOptions: {},
            },
          ],
        },
      }
    )
  })

  test('define schema with file rule and validation options', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        avatar: schema.file({ size: 10, extnames: ['jpg'] }),
      }).tree,
      {
        avatar: {
          type: 'literal',
          subtype: 'file',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'file',
              allowUndefineds: false,
              async: false,
              compiledOptions: {
                extnames: ['jpg'],
                size: 10,
              },
            },
          ],
        },
      }
    )
  })

  test('define schema with optional file rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        avatar: schema.file.optional(),
      }).tree,
      {
        avatar: {
          type: 'literal',
          subtype: 'file',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'file',
              allowUndefineds: false,
              async: false,
              compiledOptions: {},
            },
          ],
        },
      }
    )
  })

  test('define schema with nullable file rule', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        avatar: schema.file.nullable(),
      }).tree,
      {
        avatar: {
          type: 'literal',
          subtype: 'file',
          optional: false,
          nullable: true,
          rules: [
            {
              name: 'nullable',
              allowUndefineds: true,
              async: false,
              compiledOptions: [],
            },
            {
              name: 'file',
              allowUndefineds: false,
              async: false,
              compiledOptions: {},
            },
          ],
        },
      }
    )
  })

  test('define schema with optional file rule and validation options', ({ assert }) => {
    assert.deepEqual(
      schema.create({
        avatar: schema.file.optional({ size: 10, extnames: ['jpg'] }),
      }).tree,
      {
        avatar: {
          type: 'literal',
          subtype: 'file',
          optional: true,
          nullable: false,
          rules: [
            {
              name: 'file',
              allowUndefineds: false,
              async: false,
              compiledOptions: {
                extnames: ['jpg'],
                size: 10,
              },
            },
          ],
        },
      }
    )
  })
})

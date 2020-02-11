/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { rules } from '../src/Rules'
import { schema } from '../src/Schema'

test.group('Schema | String', () => {
  test('define schema with string rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.string(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'string',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'string',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema with optional string rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.string.optional(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'string',
        rules: [
          {
            name: 'string',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema with string and custom rules', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.string([rules.alpha()]),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'string',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'string',
            allowUndefineds: false,
            async: false,
          },
          {
            name: 'alpha',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })
})

test.group('Schema | Boolean', () => {
  test('define schema with boolean rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.boolean(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'boolean',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'boolean',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema with optional boolean rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.boolean.optional(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'boolean',
        rules: [
          {
            name: 'boolean',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })
})

test.group('Schema | Number', () => {
  test('define schema with number rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.number(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'number',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'number',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema with optional number rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.number.optional(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'number',
        rules: [
          {
            name: 'number',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema with number and custom rules', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.number([rules.unsigned()]),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'number',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'number',
            allowUndefineds: false,
            async: false,
          },
          {
            name: 'unsigned',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })
})

test.group('Schema | Date', () => {
  test('define schema with date rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.date(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'date',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'date',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema with optional date rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.date.optional(),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'date',
        rules: [
          {
            name: 'date',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })
})

test.group('Schema | Enum', () => {
  test('define schema with enum rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.enum(['1', '2']),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'enum',
        rules: [
          {
            name: 'required',
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
    })
  })

  test('define schema with optional enum rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.enum.optional(['1', '2']),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'enum',
        rules: [
          {
            name: 'enum',
            compiledOptions: { choices: ['1', '2'] },
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })
})

test.group('Schema | Enum Set', () => {
  test('define schema with enumSet rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.enumSet(['1', '2']),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'enumSet',
        rules: [
          {
            name: 'required',
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
    })
  })

  test('define schema with optional enumSet rule', (assert) => {
    assert.deepEqual(schema.create({
      username: schema.enumSet.optional(['1', '2']),
    }).tree, {
      username: {
        type: 'literal',
        subtype: 'enumSet',
        rules: [
          {
            name: 'enumSet',
            compiledOptions: { choices: ['1', '2'] },
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })
})

test.group('Schema | Object', () => {
  test('define schema with object', (assert) => {
    assert.deepEqual(schema.create({
      profile: schema.object().members({
        username: schema.string(),
      }),
    }).tree, {
      profile: {
        type: 'object',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'object',
            allowUndefineds: false,
            async: false,
          },
        ],
        children: {
          username: {
            type: 'literal',
            subtype: 'string',
            rules: [
              {
                name: 'required',
                allowUndefineds: true,
                async: false,
              },
              {
                name: 'string',
                allowUndefineds: false,
                async: false,
              },
            ],
          },
        },
      },
    })
  })

  test('define schema with optional object', (assert) => {
    assert.deepEqual(schema.create({
      profile: schema.object.optional().members({
        username: schema.string(),
      }),
    }).tree, {
      profile: {
        type: 'object',
        rules: [
          {
            name: 'object',
            allowUndefineds: false,
            async: false,
          },
        ],
        children: {
          username: {
            type: 'literal',
            subtype: 'string',
            rules: [
              {
                name: 'required',
                allowUndefineds: true,
                async: false,
              },
              {
                name: 'string',
                allowUndefineds: false,
                async: false,
              },
            ],
          },
        },
      },
    })
  })
})

test.group('Schema | Array', () => {
  test('define schema with array', (assert) => {
    assert.deepEqual(schema.create({
      profile: schema.array().members(schema.object().members({
        username: schema.string(),
      })),
    }).tree, {
      profile: {
        type: 'array',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'array',
            allowUndefineds: false,
            async: false,
          },
        ],
        each: {
          type: 'object',
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
            },
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
            },
          ],
          children: {
            username: {
              type: 'literal',
              subtype: 'string',
              rules: [
                {
                  name: 'required',
                  allowUndefineds: true,
                  async: false,
                },
                {
                  name: 'string',
                  allowUndefineds: false,
                  async: false,
                },
              ],
            },
          },
        },
      },
    })
  })

  test('define schema with optional array', (assert) => {
    assert.deepEqual(schema.create({
      profile: schema.array.optional().members(schema.object().members({
        username: schema.string(),
      })),
    }).tree, {
      profile: {
        type: 'array',
        rules: [
          {
            name: 'array',
            allowUndefineds: false,
            async: false,
          },
        ],
        each: {
          type: 'object',
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
            },
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
            },
          ],
          children: {
            username: {
              type: 'literal',
              subtype: 'string',
              rules: [
                {
                  name: 'required',
                  allowUndefineds: true,
                  async: false,
                },
                {
                  name: 'string',
                  allowUndefineds: false,
                  async: false,
                },
              ],
            },
          },
        },
      },
    })
  })

  test('define schema with array and custom rules', (assert) => {
    assert.deepEqual(schema.create({
      profile: schema.array([rules.maxLength(2)]).members(schema.object().members({
        username: schema.string(),
      })),
    }).tree, {
      profile: {
        type: 'array',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'array',
            allowUndefineds: false,
            async: false,
          },
          {
            name: 'maxLength',
            compiledOptions: { maxLength: 2 },
            allowUndefineds: false,
            async: false,
          },
        ],
        each: {
          type: 'object',
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
            },
            {
              name: 'object',
              allowUndefineds: false,
              async: false,
            },
          ],
          children: {
            username: {
              type: 'literal',
              subtype: 'string',
              rules: [
                {
                  name: 'required',
                  allowUndefineds: true,
                  async: false,
                },
                {
                  name: 'string',
                  allowUndefineds: false,
                  async: false,
                },
              ],
            },
          },
        },
      },
    })
  })

  test('define schema array with no members', (assert) => {
    assert.deepEqual(schema.create({
      profile: schema.array().anyMembers(),
    }).tree, {
      profile: {
        type: 'array',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'array',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema optional array with no members', (assert) => {
    assert.deepEqual(schema.create({
      profile: schema.array.optional().anyMembers(),
    }).tree, {
      profile: {
        type: 'array',
        rules: [
          {
            name: 'array',
            allowUndefineds: false,
            async: false,
          },
        ],
      },
    })
  })

  test('define schema with array of strings', (assert) => {
    assert.deepEqual(schema.create({
      scores: schema.array().members(schema.string()),
    }).tree, {
      scores: {
        type: 'array',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'array',
            allowUndefineds: false,
            async: false,
          },
        ],
        each: {
          type: 'literal',
          subtype: 'string',
          rules: [
            {
              name: 'required',
              allowUndefineds: true,
              async: false,
            },
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      },
    })
  })

  test('define schema with array of optional strings', (assert) => {
    assert.deepEqual(schema.create({
      scores: schema.array().members(schema.string.optional()),
    }).tree, {
      scores: {
        type: 'array',
        rules: [
          {
            name: 'required',
            allowUndefineds: true,
            async: false,
          },
          {
            name: 'array',
            allowUndefineds: false,
            async: false,
          },
        ],
        each: {
          type: 'literal',
          subtype: 'string',
          rules: [
            {
              name: 'string',
              allowUndefineds: false,
              async: false,
            },
          ],
        },
      },
    })
  })
})

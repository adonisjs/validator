/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { ArrayCompiler } from '../src/Compiler/Nodes/Array'
import { CompilerBuffer } from '../src/Compiler/Buffer'
import { Compiler } from '../src/Compiler'

test.group('Array Compiler', () => {
  test('compile an array node with rules and members', async ({ assert }) => {
    const objectNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [
        {
          name: 'array',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
      each: {
        type: 'object' as const,
        optional: false,
        nullable: false,
        rules: [
          {
            name: 'object',
            compiledOptions: {},
            async: false,
            allowUndefineds: true,
          },
        ],
        children: {
          username: {
            type: 'literal' as const,
            optional: false,
            nullable: false,
            subtype: 'string',
            rules: [
              {
                name: 'string',
                compiledOptions: {},
                async: false,
                allowUndefineds: true,
              },
            ],
          },
        },
      },
    }

    const field = {
      name: 'users',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['users']
      let val_0 = root['users'];
      let val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
        val_0_exists = helpers.exists(val_0);
      }
      const val_0_options = {
        root,
        refs,
        field: 'users',
        tip: root,
        pointer: 'users',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.array.validate(val_0, {}, val_0_options);

      if (val_0_exists && Array.isArray(val_0)) {
        const out_0 = out['users'] = [];
        for (let index_0 = 0; index_0 < val_0.length; index_0++) {

          // Validate val_0[index_0]
          let val_1 = val_0[index_0];
          let val_1_exists = helpers.exists(val_1);
          function mutate_val_1 (newValue) {
            val_1 = newValue;
            val_1_exists = helpers.exists(val_1);
          }
          const val_1_options = {
            root,
            refs,
            field: index_0,
            tip: val_0,
            pointer: \`users.\${index_0}\`,
            arrayExpressionPointer: 'users.*',
            mutate: mutate_val_1,
            errorReporter
          };
          validations.object.validate(val_1, {}, val_1_options);

          if (val_1_exists && helpers.isObject(val_1)) {
            const out_1 = out_0[index_0] = {};

            // Validate val_1['username']
            let val_2 = val_1['username'];
            let val_2_exists = helpers.exists(val_2);
            function mutate_val_2 (newValue) {
              val_2 = newValue;
              val_2_exists = helpers.exists(val_2);
            }
            const val_2_options = {
              root,
              refs,
              field: 'username',
              tip: val_1,
              pointer: \`users.\${index_0}.username\`,
              arrayExpressionPointer: 'users.*.username',
              mutate: mutate_val_2,
              errorReporter
            };
            validations.string.validate(val_2, {}, val_2_options);
            if (val_2_exists) {
              out_1['username'] = val_2;
            }
          }
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('compile an array node with rules and literal members', async ({ assert }) => {
    const objectNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [
        {
          name: 'array',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
      each: {
        type: 'literal' as const,
        subtype: 'string',
        optional: false,
        nullable: false,
        rules: [
          {
            name: 'string',
            compiledOptions: {},
            async: false,
            allowUndefineds: true,
          },
        ],
      },
    }

    const field = {
      name: 'users',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['users']
      let val_0 = root['users'];
      let val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
        val_0_exists = helpers.exists(val_0);
      }
      const val_0_options = {
        root,
        refs,
        field: 'users',
        tip: root,
        pointer: 'users',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.array.validate(val_0, {}, val_0_options);

      if (val_0_exists && Array.isArray(val_0)) {
        const out_0 = out['users'] = [];
        for (let index_0 = 0; index_0 < val_0.length; index_0++) {

          // Validate val_0[index_0]
          let val_1 = val_0[index_0];
          let val_1_exists = helpers.exists(val_1);
          function mutate_val_1 (newValue) {
            val_1 = newValue;
            val_1_exists = helpers.exists(val_1);
          }
          const val_1_options = {
            root,
            refs,
            field: index_0,
            tip: val_0,
            pointer: \`users.\${index_0}\`,
            arrayExpressionPointer: 'users.*',
            mutate: mutate_val_1,
            errorReporter
          };
          validations.string.validate(val_1, {}, val_1_options);
          if (val_1_exists) {
            out_0[index_0] = val_1;
          }
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('do not output any code when array has no rules and members', async ({ assert }) => {
    const arrayNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [],
    }

    const field = {
      name: 'users',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, arrayNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(buff.toString(), '')
  })

  test('do not output members validation code when no members are defined', async ({ assert }) => {
    const arrayNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [
        {
          name: 'array',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
    }

    const field = {
      name: 'users',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, arrayNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['users']
      let val_0 = root['users'];
      let val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
        val_0_exists = helpers.exists(val_0);
      }
      const val_0_options = {
        root,
        refs,
        field: 'users',
        tip: root,
        pointer: 'users',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.array.validate(val_0, {}, val_0_options);
      if (val_0_exists) {
        out['users'] = val_0;
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('use for of loop when any array immediate child has async rules', async ({ assert }) => {
    const objectNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [
        {
          name: 'array',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
      each: {
        type: 'object' as const,
        optional: false,
        nullable: false,
        rules: [
          {
            name: 'object',
            compiledOptions: {},
            async: true,
            allowUndefineds: true,
          },
        ],
        children: {
          username: {
            type: 'literal' as const,
            optional: false,
            nullable: false,
            subtype: 'string',
            rules: [
              {
                name: 'string',
                compiledOptions: {},
                async: false,
                allowUndefineds: true,
              },
            ],
          },
        },
      },
    }

    const field = {
      name: 'users',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['users']
      let val_0 = root['users'];
      let val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
        val_0_exists = helpers.exists(val_0);
      }
      const val_0_options = {
        root,
        refs,
        field: 'users',
        tip: root,
        pointer: 'users',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.array.validate(val_0, {}, val_0_options);

      if (val_0_exists && Array.isArray(val_0)) {
        const out_0 = out['users'] = [];
        for (let [index_0] of val_0.entries()) {

          // Validate val_0[index_0]
          let val_1 = val_0[index_0];
          let val_1_exists = helpers.exists(val_1);
          function mutate_val_1 (newValue) {
            val_1 = newValue;
            val_1_exists = helpers.exists(val_1);
          }
          const val_1_options = {
            root,
            refs,
            field: index_0,
            tip: val_0,
            pointer: \`users.\${index_0}\`,
            arrayExpressionPointer: 'users.*',
            mutate: mutate_val_1,
            errorReporter
          };
          await validations.object.validate(val_1, {}, val_1_options);

          if (val_1_exists && helpers.isObject(val_1)) {
            const out_1 = out_0[index_0] = {};

            // Validate val_1['username']
            let val_2 = val_1['username'];
            let val_2_exists = helpers.exists(val_2);
            function mutate_val_2 (newValue) {
              val_2 = newValue;
              val_2_exists = helpers.exists(val_2);
            }
            const val_2_options = {
              root,
              refs,
              field: 'username',
              tip: val_1,
              pointer: \`users.\${index_0}.username\`,
              arrayExpressionPointer: 'users.*.username',
              mutate: mutate_val_2,
              errorReporter
            };
            validations.string.validate(val_2, {}, val_2_options);
            if (val_2_exists) {
              out_1['username'] = val_2;
            }
          }
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('use for of loop when any of the nested children has async rules', async ({ assert }) => {
    const objectNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [
        {
          name: 'array',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
      each: {
        type: 'object' as const,
        optional: false,
        nullable: false,
        rules: [
          {
            name: 'object',
            compiledOptions: {},
            async: false,
            allowUndefineds: true,
          },
        ],
        children: {
          username: {
            type: 'literal' as const,
            optional: false,
            nullable: false,
            subtype: 'string',
            rules: [
              {
                name: 'string',
                compiledOptions: {},
                async: true,
                allowUndefineds: true,
              },
            ],
          },
        },
      },
    }

    const field = {
      name: 'users',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['users']
      let val_0 = root['users'];
      let val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
        val_0_exists = helpers.exists(val_0);
      }
      const val_0_options = {
        root,
        refs,
        field: 'users',
        tip: root,
        pointer: 'users',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.array.validate(val_0, {}, val_0_options);

      if (val_0_exists && Array.isArray(val_0)) {
        const out_0 = out['users'] = [];
        for (let [index_0] of val_0.entries()) {

          // Validate val_0[index_0]
          let val_1 = val_0[index_0];
          let val_1_exists = helpers.exists(val_1);
          function mutate_val_1 (newValue) {
            val_1 = newValue;
            val_1_exists = helpers.exists(val_1);
          }
          const val_1_options = {
            root,
            refs,
            field: index_0,
            tip: val_0,
            pointer: \`users.\${index_0}\`,
            arrayExpressionPointer: 'users.*',
            mutate: mutate_val_1,
            errorReporter
          };
          validations.object.validate(val_1, {}, val_1_options);

          if (val_1_exists && helpers.isObject(val_1)) {
            const out_1 = out_0[index_0] = {};

            // Validate val_1['username']
            let val_2 = val_1['username'];
            let val_2_exists = helpers.exists(val_2);
            function mutate_val_2 (newValue) {
              val_2 = newValue;
              val_2_exists = helpers.exists(val_2);
            }
            const val_2_options = {
              root,
              refs,
              field: 'username',
              tip: val_1,
              pointer: \`users.\${index_0}.username\`,
              arrayExpressionPointer: 'users.*.username',
              mutate: mutate_val_2,
              errorReporter
            };
            await validations.string.validate(val_2, {}, val_2_options);
            if (val_2_exists) {
              out_1['username'] = val_2;
            }
          }
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('compile nested arrays', async ({ assert }) => {
    const objectNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [
        {
          name: 'array',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
      each: {
        type: 'array' as const,
        optional: false,
        nullable: false,
        rules: [
          {
            name: 'array',
            compiledOptions: {},
            async: false,
            allowUndefineds: true,
          },
        ],
        each: {
          type: 'literal' as const,
          subtype: 'string',
          optional: false,
          nullable: false,
          rules: [
            {
              name: 'string',
              compiledOptions: {},
              async: false,
              allowUndefineds: true,
            },
          ],
        },
      },
    }

    const field = {
      name: 'geolocation',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['geolocation']
      let val_0 = root['geolocation'];
      let val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
        val_0_exists = helpers.exists(val_0);
      }
      const val_0_options = {
        root,
        refs,
        field: 'geolocation',
        tip: root,
        pointer: 'geolocation',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.array.validate(val_0, {}, val_0_options);

      if (val_0_exists && Array.isArray(val_0)) {
        const out_0 = out['geolocation'] = [];
        for (let index_0 = 0; index_0 < val_0.length; index_0++) {

          // Validate val_0[index_0]
          let val_1 = val_0[index_0];
          let val_1_exists = helpers.exists(val_1);
          function mutate_val_1 (newValue) {
            val_1 = newValue;
            val_1_exists = helpers.exists(val_1);
          }
          const val_1_options = {
            root,
            refs,
            field: index_0,
            tip: val_0,
            pointer: \`geolocation.\${index_0}\`,
            arrayExpressionPointer: 'geolocation.*',
            mutate: mutate_val_1,
            errorReporter
          };
          validations.array.validate(val_1, {}, val_1_options);

          if (val_1_exists && Array.isArray(val_1)) {
            const out_1 = out_0[index_0] = [];
            for (let index_1 = 0; index_1 < val_1.length; index_1++) {

              // Validate val_1[index_1]
              let val_2 = val_1[index_1];
              let val_2_exists = helpers.exists(val_2);
              function mutate_val_2 (newValue) {
                val_2 = newValue;
                val_2_exists = helpers.exists(val_2);
              }
              const val_2_options = {
                root,
                refs,
                field: index_1,
                tip: val_1,
                pointer: \`geolocation.\${index_0}\.\${index_1}\`,
                arrayExpressionPointer: 'geolocation.*.*',
                mutate: mutate_val_2,
                errorReporter
              };
              validations.string.validate(val_2, {}, val_2_options);
              if (val_2_exists) {
                out_1[index_1] = val_2;
              }
            }
          }
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('compile array children that has nested arrays', async ({ assert }) => {
    const objectNode = {
      type: 'array' as const,
      optional: false,
      nullable: false,
      rules: [
        {
          name: 'array',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
      each: {
        type: 'object' as const,
        optional: false,
        nullable: false,
        rules: [
          {
            name: 'object',
            compiledOptions: {},
            async: false,
            allowUndefineds: true,
          },
        ],
        children: {
          scores: {
            type: 'array' as const,
            optional: false,
            nullable: false,
            rules: [
              {
                name: 'array',
                compiledOptions: {},
                async: false,
                allowUndefineds: true,
              },
            ],
            each: {
              type: 'literal' as const,
              optional: false,
              nullable: false,
              subtype: 'string',
              rules: [
                {
                  name: 'string',
                  compiledOptions: {},
                  async: false,
                  allowUndefineds: true,
                },
              ],
            },
          },
        },
      },
    }

    const field = {
      name: 'users',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
      arrayExpressionPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ArrayCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['users']
      let val_0 = root['users'];
      let val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
        val_0_exists = helpers.exists(val_0);
      }
      const val_0_options = {
        root,
        refs,
        field: 'users',
        tip: root,
        pointer: 'users',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.array.validate(val_0, {}, val_0_options);

      if (val_0_exists && Array.isArray(val_0)) {
        const out_0 = out['users'] = [];
        for (let index_0 = 0; index_0 < val_0.length; index_0++) {

          // Validate val_0[index_0]
          let val_1 = val_0[index_0];
          let val_1_exists = helpers.exists(val_1);
          function mutate_val_1 (newValue) {
            val_1 = newValue;
            val_1_exists = helpers.exists(val_1);
          }
          const val_1_options = {
            root,
            refs,
            field: index_0,
            tip: val_0,
            pointer: \`users.\${index_0}\`,
            arrayExpressionPointer: 'users.*',
            mutate: mutate_val_1,
            errorReporter
          };
          validations.object.validate(val_1, {}, val_1_options);

          if (val_1_exists && helpers.isObject(val_1)) {
            const out_1 = out_0[index_0] = {};

            // Validate val_1['scores']
            let val_2 = val_1['scores'];
            let val_2_exists = helpers.exists(val_2);
            function mutate_val_2 (newValue) {
              val_2 = newValue;
              val_2_exists = helpers.exists(val_2);
            }
            const val_2_options = {
              root,
              refs,
              field: 'scores',
              tip: val_1,
              pointer: \`users.\${index_0}.scores\`,
              arrayExpressionPointer: 'users.*.scores',
              mutate: mutate_val_2,
              errorReporter
            };
            validations.array.validate(val_2, {}, val_2_options);

            if (val_2_exists && Array.isArray(val_2)) {
              const out_2 = out_1['scores'] = [];
              for (let index_1 = 0; index_1 < val_2.length; index_1++) {

                // Validate val_2[index_1]
                let val_3 = val_2[index_1];
                let val_3_exists = helpers.exists(val_3);
                function mutate_val_3 (newValue) {
                  val_3 = newValue;
                  val_3_exists = helpers.exists(val_3);
                }
                const val_3_options = {
                  root,
                  refs,
                  field: index_1,
                  tip: val_2,
                  pointer: \`users.\${index_0}\.scores.\${index_1}\`,
                  arrayExpressionPointer: 'users.*.scores.*',
                  mutate: mutate_val_3,
                  errorReporter
                };
                validations.string.validate(val_3, {}, val_3_options);
                if (val_3_exists) {
                  out_2[index_1] = val_3;
                }
              }
            }
          }
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })
})

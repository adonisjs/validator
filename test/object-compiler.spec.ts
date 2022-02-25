/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { Compiler } from '../src/Compiler'
import { ObjectCompiler } from '../src/Compiler/Nodes/Object'
import { CompilerBuffer } from '../src/Compiler/Buffer'

test.group('Object Compiler', () => {
  test('compile an object node with rules', async ({ assert }) => {
    const objectNode = {
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
    }

    const field = {
      name: 'user',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ObjectCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['user']
      let val_0 = root['user'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        refs,
        field: 'user',
        tip: root,
        pointer: 'user',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.object.validate(val_0, {}, val_0_options);

      if (val_0_exists && helpers.isObject(val_0)) {
        const out_0 = out['user'] = {};

        // Validate val_0['username']
        let val_1 = val_0['username'];
        const val_1_exists = helpers.exists(val_1);
        function mutate_val_1 (newValue) {
          val_1 = newValue;
        }
        const val_1_options = {
          root,
          refs,
          field: 'username',
          tip: val_0,
          pointer: 'user.username',
          mutate: mutate_val_1,
          errorReporter
        };
        validations.string.validate(val_1, {}, val_1_options);
        if (val_1_exists) {
          out_0['username'] = val_1;
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('compile a nested object node with rules', async ({ assert }) => {
    const objectNode = {
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
        profile: {
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
      },
    }

    const field = {
      name: 'user',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ObjectCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['user']
      let val_0 = root['user'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        refs,
        field: 'user',
        tip: root,
        pointer: 'user',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.object.validate(val_0, {}, val_0_options);

      if (val_0_exists && helpers.isObject(val_0)) {
        const out_0 = out['user'] = {};

        // Validate val_0['profile']
        let val_1 = val_0['profile'];
        const val_1_exists = helpers.exists(val_1);
        function mutate_val_1 (newValue) {
          val_1 = newValue;
        }
        const val_1_options = {
          root,
          refs,
          field: 'profile',
          tip: val_0,
          pointer: 'user.profile',
          mutate: mutate_val_1,
          errorReporter
        };
        validations.object.validate(val_1, {}, val_1_options);

        if (val_1_exists && helpers.isObject(val_1)) {
          const out_1 = out_0['profile'] = {};

          // Validate val_1['username']
          let val_2 = val_1['username'];
          const val_2_exists = helpers.exists(val_2);
          function mutate_val_2 (newValue) {
            val_2 = newValue;
          }
          const val_2_options = {
            root,
            refs,
            field: 'username',
            tip: val_1,
            pointer: 'user.profile.username',
            mutate: mutate_val_2,
            errorReporter
          };
          validations.string.validate(val_2, {}, val_2_options);
          if (val_2_exists) {
            out_1['username'] = val_2;
          }
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('do not output code for members validation when node has no children', async ({
    assert,
  }) => {
    const objectNode = {
      type: 'object' as const,
      subtype: 'string',
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
      children: {},
    }

    const field = {
      name: 'user',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ObjectCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['user']
      let val_0 = root['user'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        refs,
        field: 'user',
        tip: root,
        pointer: 'user',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.object.validate(val_0, {}, val_0_options);
      if (val_0_exists) {
        out['user'] = {};
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('do not output code for members validation when children are undefined', async ({
    assert,
  }) => {
    const objectNode = {
      type: 'object' as const,
      subtype: 'string',
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
    }

    const field = {
      name: 'user',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ObjectCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['user']
      let val_0 = root['user'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        refs,
        field: 'user',
        tip: root,
        pointer: 'user',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.object.validate(val_0, {}, val_0_options);
      if (val_0_exists) {
        out['user'] = val_0;
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('do not output code for object validation when no rules have been defined', async ({
    assert,
  }) => {
    const objectNode = {
      type: 'object' as const,
      subtype: 'string',
      rules: [],
      optional: false,
      nullable: false,
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
    }

    const field = {
      name: 'user',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ObjectCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['user']
      let val_0 = root['user'];
      const val_0_exists = helpers.exists(val_0);

      if (val_0_exists && helpers.isObject(val_0)) {
        const out_0 = out['user'] = {};

        // Validate val_0['username']
        let val_1 = val_0['username'];
        const val_1_exists = helpers.exists(val_1);
        function mutate_val_1 (newValue) {
          val_1 = newValue;
        }
        const val_1_options = {
          root,
          refs,
          field: 'username',
          tip: val_0,
          pointer: 'user.username',
          mutate: mutate_val_1,
          errorReporter
        };
        validations.string.validate(val_1, {}, val_1_options);
        if (val_1_exists) {
          out_0['username'] = val_1;
        }
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })

  test('set null on out value when node has nullable = true', async ({ assert }) => {
    const objectNode = {
      type: 'object' as const,
      optional: false,
      nullable: true,
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
    }

    const field = {
      name: 'user',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const objectCompiler = new ObjectCompiler(field, objectNode, compiler, references)
    objectCompiler.compile(buff)

    assert.deepEqual(
      buff
        .toString()
        .split('\n')
        .map((line) => line.trim()),
      `// Validate root['user']
      let val_0 = root['user'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        refs,
        field: 'user',
        tip: root,
        pointer: 'user',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.object.validate(val_0, {}, val_0_options);

      if (val_0_exists && helpers.isObject(val_0)) {
        const out_0 = out['user'] = {};

        // Validate val_0['username']
        let val_1 = val_0['username'];
        const val_1_exists = helpers.exists(val_1);
        function mutate_val_1 (newValue) {
          val_1 = newValue;
        }
        const val_1_options = {
          root,
          refs,
          field: 'username',
          tip: val_0,
          pointer: 'user.username',
          mutate: mutate_val_1,
          errorReporter
        };
        validations.string.validate(val_1, {}, val_1_options);
        if (val_1_exists) {
          out_0['username'] = val_1;
        }
      }
      else if (val_0 === null) {
        out['user'] = null;
      }`
        .split('\n')
        .map((line) => line.trim())
    )
  })
})

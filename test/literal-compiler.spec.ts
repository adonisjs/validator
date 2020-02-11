/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import endent from 'endent'

import { Compiler } from '../src/Compiler'
import { LiteralCompiler } from '../src/Compiler/Nodes/Literal'
import { CompilerBuffer } from '../src/Compiler/Buffer'

test.group('Literal Compiler', () => {
  test('do not output compiled code when field has no rules applied', async (assert) => {
    const literalNode = {
      type: 'literal' as const,
      subtype: 'string',
      rules: [],
    }

    const field = {
      name: 'username',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const literal = new LiteralCompiler(field, literalNode, compiler, references)
    literal.compile(buff)
    assert.deepEqual(buff.toString(), '')
  })

  test('compile a literal node with rules', async (assert) => {
    const literalNode = {
      type: 'literal' as const,
      subtype: 'string',
      rules: [
        {
          name: 'string',
          compiledOptions: {},
          async: false,
          allowUndefineds: true,
        },
      ],
    }

    const field = {
      name: 'username',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const literal = new LiteralCompiler(field, literalNode, compiler, references)
    literal.compile(buff)

    assert.deepEqual(buff.toString().split('\n'), endent`
      // Validate root['username']
      let val_0 = root['username'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        tip: root,
        pointer: 'username',
        mutate: mutate_val_0,
        errorReporter
      };
      validations.string.validate(val_0, {}, val_0_options);
      if (val_0_exists) {
        out['username'] = val_0;
      }
    `.split('\n'))
  })

  test('add exists guard when rule doesn\'t want to run on undefineds', async (assert) => {
    const literalNode = {
      type: 'literal' as const,
      subtype: 'string',
      rules: [
        {
          name: 'string',
          compiledOptions: {},
          async: false,
          allowUndefineds: false,
        },
      ],
    }

    const field = {
      name: 'username',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const literal = new LiteralCompiler(field, literalNode, compiler, references)
    literal.compile(buff)

    assert.deepEqual(buff.toString().split('\n'), endent`
      // Validate root['username']
      let val_0 = root['username'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        tip: root,
        pointer: 'username',
        mutate: mutate_val_0,
        errorReporter
      };
      val_0_exists && validations.string.validate(val_0, {}, val_0_options);
      if (val_0_exists) {
        out['username'] = val_0;
      }
    `.split('\n'))
  })

  test('await async validations', async (assert) => {
    const literalNode = {
      type: 'literal' as const,
      subtype: 'string',
      rules: [
        {
          name: 'string',
          compiledOptions: {},
          async: true,
          allowUndefineds: true,
        },
      ],
    }

    const field = {
      name: 'username',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const literal = new LiteralCompiler(field, literalNode, compiler, references)
    literal.compile(buff)

    assert.deepEqual(buff.toString().split('\n'), endent`
      // Validate root['username']
      let val_0 = root['username'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        tip: root,
        pointer: 'username',
        mutate: mutate_val_0,
        errorReporter
      };
      await validations.string.validate(val_0, {}, val_0_options);
      if (val_0_exists) {
        out['username'] = val_0;
      }
    `.split('\n'))
  })

  test('add exists guard when async rule doesn\'t want to run on undefineds', async (assert) => {
    const literalNode = {
      type: 'literal' as const,
      subtype: 'string',
      rules: [
        {
          name: 'string',
          compiledOptions: {},
          async: true,
          allowUndefineds: false,
        },
      ],
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const field = {
      name: 'username',
      type: 'literal' as const,
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const literal = new LiteralCompiler(field, literalNode, compiler, references)
    literal.compile(buff)

    assert.deepEqual(buff.toString().split('\n'), endent`
      // Validate root['username']
      let val_0 = root['username'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        tip: root,
        pointer: 'username',
        mutate: mutate_val_0,
        errorReporter
      };
      val_0_exists && await validations.string.validate(val_0, {}, val_0_options);
      if (val_0_exists) {
        out['username'] = val_0;
      }
    `.split('\n'))
  })

  test('declare variable when no rules are defined but "forceValueDeclaration = true"', async (assert) => {
    const literalNode = {
      type: 'literal' as const,
      subtype: 'string',
      rules: [],
    }

    const field = {
      name: 'username',
      type: 'literal' as const,
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const literal = new LiteralCompiler(field, literalNode, compiler, references)
    literal.forceValueDeclaration = true
    literal.compile(buff)
    assert.deepEqual(buff.toString().split('\n'), endent`
      // Validate root['username']
      let val_0 = root['username'];
      const val_0_exists = helpers.exists(val_0);
    `.split('\n'))
  })

  test('do not assign out value when "disableOutVariable = true"', async (assert) => {
    const literalNode = {
      type: 'literal' as const,
      subtype: 'string',
      rules: [
        {
          name: 'string',
          compiledOptions: {},
          async: true,
          allowUndefineds: false,
        },
      ],
    }

    const references = {
      outVariable: 'out',
      referenceVariable: 'root',
      parentPointer: [],
    }

    const field = {
      name: 'username',
      type: 'literal' as const,
    }

    const compiler = new Compiler({})
    const buff = new CompilerBuffer()

    const literal = new LiteralCompiler(field, literalNode, compiler, references)
    literal.disableOutVariable = true
    literal.compile(buff)

    assert.deepEqual(buff.toString().split('\n'), endent`
      // Validate root['username']
      let val_0 = root['username'];
      const val_0_exists = helpers.exists(val_0);
      function mutate_val_0 (newValue) {
        val_0 = newValue;
      }
      const val_0_options = {
        root,
        tip: root,
        pointer: 'username',
        mutate: mutate_val_0,
        errorReporter
      };
      val_0_exists && await validations.string.validate(val_0, {}, val_0_options);
    `.split('\n'))
  })
})

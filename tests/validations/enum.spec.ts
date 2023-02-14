/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { rules } from '../../src/rules/index.js'
import { schema } from '../../src/schema/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { oneOf } from '../../src/validations/primitives/enum.js'

function compile(choices: any) {
  return oneOf.compile('literal', 'enum', (rules as any)['enum'](choices).options, {})
}

test.group('enum', () => {
  validate(oneOf, test, '10', '2', compile(['1', '2']))

  test('do not compile when choices are not defined', ({ assert }) => {
    const fn = () => oneOf.compile('literal', 'string')
    assert.throws(fn, '"enum": The 3rd argument must be a combined array of arguments')
  })

  test('do not compile when choices not an array of values', ({ assert }) => {
    const fn = () => oneOf.compile('literal', 'string', ['foo'])
    assert.throws(fn, '"enum": expects an array of choices or a "ref"')
  })

  test('report error when value is not in the defined array', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    oneOf.validate('3', compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'points',
          rule: 'enum',
          args: { choices: ['1', '2'] },
          message: 'enum validation failed',
        },
      ],
    })
  })

  test('report error when value is null', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    oneOf.validate(null, compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'points',
          rule: 'enum',
          args: { choices: ['1', '2'] },
          message: 'enum validation failed',
        },
      ],
    })
  })

  test('work fine when value is in the defined array', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    oneOf.validate('1', compile(['1', '2']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('define options as a reference', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const validator = {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: schema.refs({
        points: ['1', '2'],
      }),
      mutate: () => {},
    }

    const compiled = compile(validator.refs.points).compiledOptions!
    oneOf.validate('1', compiled, validator)
    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('re-use the same compiled schema with different refs', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const validator = {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: schema.refs({
        points: ['1', '2'],
      }),
      mutate: () => {},
    }

    const compiled = compile(validator.refs.points).compiledOptions!
    oneOf.validate('1', compiled, validator)
    assert.deepEqual(reporter.toJSON(), { errors: [] })

    validator.refs = schema.refs({ points: [] })
    oneOf.validate('1', compiled, validator)
    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          rule: 'enum',
          field: 'points',
          message: 'enum validation failed',
          args: {
            choices: [],
          },
        },
      ],
    })
  })
})

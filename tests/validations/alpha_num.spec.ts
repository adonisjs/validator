/*alphaNum
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { alphaNum } from '../../src/validations/string/alpha_num.js'

function compile(options?: { allow?: ('space' | 'underscore' | 'dash')[] }) {
  return alphaNum.compile('literal', 'string', rules.alphaNum(options).options, {})
}

test.group('AlphaNum', () => {
  validate(alphaNum, test, '*9999', 'hello', compile())

  test('ignore validation when value is not a valid string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    alphaNum.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [],
    })
  })

  test('report error when value fails the alphaNum regex', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    alphaNum.validate('hello-22', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'alphaNum',
          message: 'alphaNum validation failed',
        },
      ],
    })
  })

  test('work fine when value passes the alphaNum regex', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    alphaNum.validate('hello', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [],
    })
  })

  test('allow space with alphaNum characters', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    alphaNum.validate('hello world', compile({ allow: ['space'] }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [],
    })
  })

  test('allow space, dash with alphaNum characters', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    alphaNum.validate('he-llo world', compile({ allow: ['space', 'dash'] }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [],
    })
  })

  test('allow space, dash and underscore with alphaNum characters', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    alphaNum.validate(
      'he l-lo_world09',
      compile({ allow: ['space', 'dash', 'underscore'] }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'username',
        pointer: 'username',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [],
    })
  })
})

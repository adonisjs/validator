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
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { unsigned } from '../../src/validations/number/unsigned.js'

function compile() {
  return unsigned.compile('literal', 'number', rules.unsigned().options, {})
}

test.group('unsigned', () => {
  validate(unsigned, test, -10, 10, compile())

  test('report error when value is not an unsigned number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    unsigned.validate(-10, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'age',
          rule: 'unsigned',
          message: 'unsigned validation failed',
        },
      ],
    })
  })

  test('skip when value is not a number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    unsigned.validate('-10', compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('work fine when value is a valid unsigned value', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    unsigned.validate(1, compile().compiledOptions!, {
      errorReporter: reporter,
      field: 'age',
      pointer: 'age',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

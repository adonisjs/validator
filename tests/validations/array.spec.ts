/*
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
import { array } from '../../src/validations/primitives/array.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'

function compile() {
  return array.compile('array', 'array', (rules as any)['array']().options, {})
}

test.group('array', () => {
  validate(array, test, null, [], compile())

  test('report error when value is not a valid array', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    array.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'addresses',
      pointer: 'addresses',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'addresses',
          rule: 'array',
          message: 'array validation failed',
        },
      ],
    })
  })

  test('work fine when value is a valid array', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    array.validate([], compile().compiledOptions, {
      errorReporter: reporter,
      field: 'addresses',
      pointer: 'terms',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [],
    })
  })
})

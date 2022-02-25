/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { MessagesBag } from '../../src/MessagesBag'
import { validate } from '../fixtures/error-reporters'
import { ApiErrorReporter } from '../../src/ErrorReporter/index'

test.group('Api ErrorReporter', () => {
  validate(ApiErrorReporter, test, (messages) => {
    return messages.errors.map((message) => {
      return {
        message: message.message,
        field: message.field,
      }
    })
  })

  test('do set flash messages to true when returning ValidationException instance', ({
    assert,
  }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    assert.isFalse(reporter.toError().flashToSession)
  })

  test('return error messages as an array of objects', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    reporter.report('username', 'required', 'required validation failed')
    reporter.report('username', 'alpha', 'alpha validation failed', undefined, { isRegex: true })
    reporter.report('age', 'required', 'required validation failed')

    assert.deepEqual(reporter.toError().messages, {
      errors: [
        {
          field: 'username',
          rule: 'required',
          message: 'required validation failed',
        },
        {
          field: 'username',
          rule: 'alpha',
          message: 'alpha validation failed',
          args: { isRegex: true },
        },
        {
          field: 'age',
          rule: 'required',
          message: 'required validation failed',
        },
      ],
    })
  })
})

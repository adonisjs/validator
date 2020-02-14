/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import test from 'japa'
import { JsonApiErrorReporter } from '../../src/ErrorReporter/index'
import { validate } from '../fixtures/error-reporters'

test.group('JSON API ErrorReporter', () => {
  validate(JsonApiErrorReporter, test, ({ errors }) => {
    return errors.map((error) => {
      return {
        message: error.detail,
        field: error.source.pointer,
      }
    })
  })

  test('do set flash messages to true when returning ValidationException instance', (assert) => {
    const reporter = new JsonApiErrorReporter({}, false)
    assert.isFalse(reporter.toError().flashToSession)
  })

  test('return error messages as an array of objects', (assert) => {
    const reporter = new JsonApiErrorReporter({}, false)
    reporter.report('username', 'required', 'required validation failed')
    reporter.report('username', 'alpha', 'alpha validation failed', undefined, { isRegex: true })
    reporter.report('age', 'required', 'required validation failed')

    assert.deepEqual(reporter.toError().messages, {
      errors: [
        {
          source: {
            pointer: 'username',
          },
          code: 'required',
          detail: 'required validation failed',
        },
        {
          source: {
            pointer: 'username',
          },
          code: 'alpha',
          detail: 'alpha validation failed',
          meta: { isRegex: true },
        },
        {
          source: {
            pointer: 'age',
          },
          code: 'required',
          detail: 'required validation failed',
        },
      ],
    })
  })
})

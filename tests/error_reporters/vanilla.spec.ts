/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { validate } from '../fixtures/error_reporters/index.js'
import { VanillaErrorReporter } from '../../src/error_reporter/index.js'

test.group('Vanilla ErrorReporter', () => {
  validate(VanillaErrorReporter, test, (messages) => {
    return Object.keys(messages).reduce((errors, field) => {
      messages[field].forEach((message: any) => {
        errors.push({ field, message })
      })
      return errors
    }, [] as { field: string; message: string }[])
  })

  test('set flash messages to true when returning ValidationException instance', ({ assert }) => {
    const reporter = new VanillaErrorReporter(new MessagesBag({}), false)
    assert.isTrue(reporter.toError().flashToSession)
  })

  test("return error messages as a key-value pair of field and it's messages", ({ assert }) => {
    const reporter = new VanillaErrorReporter(new MessagesBag({}), false)
    reporter.report('username', 'required', 'required validation failed')
    reporter.report('username', 'alpha', 'alpha validation failed')
    reporter.report('username', 'alphaNum', 'alphaNum validation failed')
    reporter.report('age', 'required', 'required validation failed')

    assert.deepEqual(reporter.toError().messages, {
      username: [
        'required validation failed',
        'alpha validation failed',
        'alphaNum validation failed',
      ],
      age: ['required validation failed'],
    })
  })
})

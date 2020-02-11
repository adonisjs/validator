/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import test from 'japa'
import { ApiErrorReporter } from '../../src/ErrorReporter/index'
import { validate } from '../fixtures/error-reporters'

test.group('Api ErrorReporter', () => {
  validate(ApiErrorReporter, test, (messages) => {
    return messages.map((message) => {
      return {
        message: message.message,
        field: message.field,
      }
    })
  })
})

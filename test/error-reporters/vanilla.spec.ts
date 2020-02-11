/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import test from 'japa'
import { VanillaErrorReporter } from '../../src/ErrorReporter/index'
import { validate } from '../fixtures/error-reporters'

test.group('Vanilla ErrorReporter', () => {
  validate(VanillaErrorReporter, test, (messages) => {
    return Object.keys(messages).reduce((errors, field) => {
      messages[field].forEach((message: any) => {
        errors.push({ field, message })
      })
      return errors
    }, [] as { field: string, message: string }[])
  })
})

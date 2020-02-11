/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'date validation failed'

/**
 * Ensure the value is a valid date instance
 */
export const date: SyncValidation = {
  compile () {
    return {
      allowUndefineds: false,
      async: false,
      name: 'date',
    }
  },
  validate (value, _, { errorReporter, pointer }) {
    if (value instanceof Date === false) {
      errorReporter.report(pointer, DEFAULT_MESSAGE)
    }
  },
}

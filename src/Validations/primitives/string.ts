/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'string validation failed'
const RULE_NAME = 'string'

/**
 * Ensure value is a valid string
 * @type {SyncValidation}
 */
export const string: SyncValidation = {
  compile () {
    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: undefined,
    }
  },
  validate (value, _, { pointer, errorReporter, arrayExpressionPointer }) {
    if (typeof (value) !== 'string') {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'object validation failed'
const RULE_NAME = 'object'

/**
 * Ensure value is a valid object
 */
export const object: SyncValidation = {
  compile () {
    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: undefined,
    }
  },
  validate (value, _, { errorReporter, pointer, arrayExpressionPointer }) {
    if (typeof (value) !== 'object' || Array.isArray(value) || value === null) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

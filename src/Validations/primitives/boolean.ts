/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const BOOLEAN_POSITIVES = [ '1', 1 ]
const BOOLEAN_NEGATIVES = [ '0', 0 ]
const DEFAULT_MESSAGE = 'boolean validation failed'

/**
 * Ensure value is a valid boolean or a valid boolean representation
 * as a number or a string.
 *
 * - 0,'0' are casted to false
 * - 1,'1' are casted to true
 */
export const boolean: SyncValidation = {
  compile () {
    return {
      allowUndefineds: false,
      async: false,
      name: 'boolean',
    }
  },
  validate (value, _, { mutate, pointer, errorReporter, arrayExpressionPointer }) {
    if (typeof (value) === 'boolean') {
      return
    }

    if (BOOLEAN_POSITIVES.includes(value)) {
      mutate(true)
      return
    }

    if (BOOLEAN_NEGATIVES.includes(value)) {
      mutate(false)
      return
    }

    errorReporter.report(pointer, 'boolean', DEFAULT_MESSAGE, arrayExpressionPointer)
  },
}

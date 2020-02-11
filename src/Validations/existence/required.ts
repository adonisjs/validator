/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'required validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const required: SyncValidation = {
  compile () {
    return {
      allowUndefineds: true,
      async: false,
      name: 'required',
    }
  },
  validate (value, _, { errorReporter, pointer, arrayExpressionPointer }) {
    if (!value && value !== false && value !== 0) {
      errorReporter.report(pointer, 'required', DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

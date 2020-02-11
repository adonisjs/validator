/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'array validation failed'

/**
 * Ensure value is a valid array
 */
export const array: SyncValidation = {
  compile () {
    return {
      allowUndefineds: false,
      async: false,
      name: 'array',
    }
  },
  validate (value, _, { pointer, arrayExpressionPointer, errorReporter }) {
    if (!Array.isArray(value)) {
      errorReporter.report(pointer, 'array', DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

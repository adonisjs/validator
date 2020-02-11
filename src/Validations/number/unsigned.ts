/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'unsigned validation failed'

export const unsigned: SyncValidation = {
  compile (_, subtype) {
    if (subtype !== 'number') {
      throw new Error(`Cannot use unsigned rule on "${subtype}" data type.`)
    }

    return {
      allowUndefineds: false,
      async: false,
      name: 'unsigned',
    }
  },
  validate (value, _, { errorReporter, arrayExpressionPointer, pointer }) {
    if (typeof (value) !== 'number') {
      return
    }

    if (value < 0) {
      errorReporter.report(pointer, 'unsigned', DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

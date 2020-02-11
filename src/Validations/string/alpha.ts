/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'alpha validation failed'

/**
 * Validation signature for the "alpha" regex. Non-string values are
 * ignored.
 */
export const alpha: SyncValidation = {
  compile (_, subtype) {
    if (subtype !== 'string') {
      throw new Error(`Cannot use alpha rule on "${subtype}" data type.`)
    }

    return {
      allowUndefineds: false,
      async: false,
      name: 'alpha',
    }
  },
  validate (value, _, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof (value) !== 'string') {
      return
    }

    if (!/^[a-zA-z]+$/.test(value)) {
      errorReporter.report(pointer, 'alpha', DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

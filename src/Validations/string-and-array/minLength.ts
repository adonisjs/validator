/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { ensureValidArgs } from '../../Validator/helpers'

const RULE_NAME = 'minLength'
const DEFAULT_MESSAGE = 'minLength validation failed'

/**
 * Ensure the length of an array of a string is above the
 * defined length
 */
export const minLength: SyncValidation<{ minLength: number }> = {
  compile (_, subtype, args) {
    ensureValidArgs(RULE_NAME, args)
    const [limit] = args

    if (!['string', 'array'].includes(subtype)) {
      throw new Error(`Cannot use "${RULE_NAME}" rule on "${subtype}" data type`)
    }

    if (typeof (limit) !== 'number') {
      throw new Error(`The limit value for "${RULE_NAME}" must be defined as a number`)
    }

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: { minLength: limit },
    }
  },
  validate (value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (typeof (value) !== 'string' && !Array.isArray(value)) {
      return
    }

    if (value.length < compiledOptions.minLength) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
    }
  },
}

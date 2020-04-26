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

const DEFAULT_MESSAGE = 'regex validation failed'
const RULE_NAME = 'regex'

/**
 * Validation signature for the "alpha" regex. Non-string values are
 * ignored.
 */
export const regex: SyncValidation<{regexPattern: RegExp}> = {
  compile (_, subtype, args) {
    ensureValidArgs(RULE_NAME, args)
    const [regexPattern] = args
    if (subtype !== 'string') {
      throw new Error(`Cannot use regex rule on "${subtype}" data type.`)
    }

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: { regexPattern },
    }
  },
  validate (value, { regexPattern }, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof (value) !== 'string') {
      return
    }

    if (!regexPattern.test(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

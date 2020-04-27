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
export const regex: SyncValidation<{pattern: string, flags: string}> = {
  compile (_, subtype, args) {
    if (subtype !== 'string') {
      throw new Error(`Cannot use regex rule on "${subtype}" data type.`)
    }

    ensureValidArgs(RULE_NAME, args)
    const [ regexPattern ] = args
    if (!regexPattern || regexPattern instanceof RegExp === false) {
      throw new Error(`The "${RULE_NAME}" rule expects pattern to be a valid regex`)
    }

    const match = regexPattern.toString().match(/^\/(.*)\/([gimuy]*)$/)
    if (!match) {
      throw new Error('Unable to serialize regex. Contact package author')
    }

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: { pattern: match[1], flags: match[2] },
    }
  },
  validate (value, { pattern, flags }, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof (value) !== 'string') {
      return
    }

    if (!new RegExp(pattern, flags).test(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

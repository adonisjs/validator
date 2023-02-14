/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'
import { wrapCompile } from '../../validator/helpers.js'

const RULE_NAME = 'regex'
const DEFAULT_MESSAGE = 'regex validation failed'

/**
 * Validation signature for the "alpha" regex. Non-string values are
 * ignored.
 */
export const regex: SyncValidation<{ pattern: string; flags: string }> = {
  compile: wrapCompile(RULE_NAME, ['string'], ([regexPattern]) => {
    if (!regexPattern || regexPattern instanceof RegExp === false) {
      throw new Error(`The "${RULE_NAME}" rule expects pattern to be a valid regex`)
    }

    const match = regexPattern.toString().match(/^\/(.*)\/([gimuy]*)$/)
    if (!match) {
      throw new Error(
        'Unable to serialize regex. Please open an issue in "@adonisjs/validator" repo'
      )
    }

    return {
      compiledOptions: { pattern: match[1], flags: match[2] },
    }
  }),
  validate(value, { pattern, flags }, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof value !== 'string') {
      return
    }

    if (!new RegExp(pattern, flags).test(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

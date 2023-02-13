/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'
import { wrapCompile } from '../../validator/helpers.js'

const RULE_NAME = 'alphaNum'
const DEFAULT_MESSAGE = 'alphaNum validation failed'

/**
 * Validation signature for the "alphaNum" regex. Non-string values are
 * ignored.
 */
export const alphaNum: SyncValidation<{ pattern: string }> = {
  compile: wrapCompile(RULE_NAME, ['string'], ([options]) => {
    let charactersMatch = 'a-zA-Z0-9'

    /**
     * Allow only alphaNum characters
     */
    if (!options || !options.allow || !Array.isArray(options.allow)) {
      return {
        compiledOptions: {
          pattern: `^[${charactersMatch}]+$`,
        },
      }
    }

    /**
     * Allow spaces
     */
    if (options.allow.includes('space')) {
      charactersMatch += '\\s'
    }

    /**
     * Allow dash charcater
     */
    if (options.allow.includes('dash')) {
      charactersMatch += '-'
    }

    /**
     * Allow underscores
     */
    if (options.allow.includes('underscore')) {
      charactersMatch += '_'
    }

    return {
      compiledOptions: {
        pattern: `^[${charactersMatch}]+$`,
      },
    }
  }),
  validate(value, { pattern }, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof value !== 'string') {
      return
    }

    if (!new RegExp(pattern).test(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

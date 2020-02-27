/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import escape from 'validator/lib/escape'
import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { ensureValidArgs } from '../../utils'

const DEFAULT_MESSAGE = 'string validation failed'
const RULE_NAME = 'string'

/**
 * Ensure value is a valid string
 * @type {SyncValidation}
 */
export const string: SyncValidation<{ escape: boolean, trim: boolean }> = {
  compile (_, __, args) {
    ensureValidArgs(RULE_NAME, args)
    const [options] = args

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: {
        escape: !!(options && options.escape),
        trim: options && options.trim === false ? false : true,
      },
    }
  },
  validate (value, compiledOptions, { pointer, errorReporter, arrayExpressionPointer, mutate }) {
    if (typeof (value) !== 'string') {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    let mutated = false

    /**
     * Escape string
     */
    if (compiledOptions.escape) {
      mutated = true
      value = escape(value)
    }

    /**
     * Trim whitespaces
     */
    if (compiledOptions.trim) {
      mutated = true
      value = value.trim()
    }

    mutated && mutate(value)
  },
}

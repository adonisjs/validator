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
import { wrapCompile } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'string validation failed'
const RULE_NAME = 'string'

/**
 * Ensure value is a valid string
 * @type {SyncValidation}
 */
export const string: SyncValidation<{
  escape: boolean
  trim: boolean
  upperCase: boolean
  lowerCase: boolean
}> = {
  compile: wrapCompile(RULE_NAME, [], ([options]) => {
    return {
      compiledOptions: {
        escape: !!(options && options.escape),
        trim: !!(options && options.trim),
        upperCase: !!(options && options.upperCase),
        lowerCase: !!(options && options.lowerCase),
      },
    }
  }),
  validate(value, compiledOptions, { pointer, errorReporter, arrayExpressionPointer, mutate }) {
    if (typeof value !== 'string') {
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

    /**
     * UpperCase string
     */
    if (compiledOptions.upperCase) {
      mutated = true
      value = value.toLocaleUpperCase()
    }

    /**
     * LowerCase string
     */
    if (compiledOptions.lowerCase) {
      mutated = true
      value = value.toLocaleLowerCase()
    }

    mutated && mutate(value)
  },
}

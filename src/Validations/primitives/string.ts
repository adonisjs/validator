/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import escape from 'validator/lib/escape'
import { string as stringHelpers } from '@poppinss/utils/build/helpers'
import { StringOptions, SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'string validation failed'
const RULE_NAME = 'string'

/**
 * Ensure value is a valid string
 * @type {SyncValidation}
 */
export const string: SyncValidation<StringOptions> = {
  compile: wrapCompile(RULE_NAME, [], ([options]) => {
    return {
      compiledOptions: {
        case: options && options.case,
        singularize: !!(options && options.singularize),
        pluralize: !!(options && options.pluralize),
        condenseWhitespace: !!(options && options.condenseWhitespace),
        escape: !!(options && options.escape),
        trim: !!(options && options.trim),
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
     * Change string case
     */
    if (compiledOptions.case) {
      /**
       * Using poppinss.utils
       */
      if (
        [
          'camelCase',
          'snakeCase',
          'dashCase',
          'pascalCase',
          'capitalCase',
          'sentenceCase',
          'dotCase',
          'titleCase',
          'noCase',
        ].includes(compiledOptions.case)
      ) {
        mutated = true
        value = stringHelpers[compiledOptions.case](value)
      }

      /**
       * To lowerCase
       */
      if (compiledOptions.case === 'lowerCase') {
        mutated = true
        value = value.toLowerCase()
      }

      /**
       * To upperCase
       */
      if (compiledOptions.case === 'upperCase') {
        mutated = true
        value = value.toUpperCase()
      }
    }

    /**
     * Pluralize string
     */
    if (compiledOptions.pluralize) {
      mutated = true
      value = stringHelpers.pluralize(value)
    }

    /**
     * Singularize string
     */
    if (compiledOptions.singularize) {
      mutated = true
      value = stringHelpers.singularize(value)
    }

    /**
     * Condense white space
     */
    if (compiledOptions.condenseWhitespace) {
      mutated = true
      value = stringHelpers.condenseWhitespace(value)
    }

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

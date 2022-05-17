/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation, NodeSubType } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'maxLength'
const DEFAULT_MESSAGE = 'maxLength validation failed'

/**
 * Ensure the length of an array of a string is under the
 * defined length
 */
export const maxLength: SyncValidation<{ maxLength: number; subtype: NodeSubType }> = {
  compile: wrapCompile(RULE_NAME, ['string', 'array'], ([limit], _, subtype) => {
    if (typeof limit !== 'number') {
      throw new Error(`The limit value for "${RULE_NAME}" must be defined as a number`)
    }

    return {
      compiledOptions: {
        maxLength: limit,
        subtype: subtype,
      },
    }
  }),
  validate(value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (compiledOptions.subtype === 'array' && !Array.isArray(value)) {
      return
    } else if (compiledOptions.subtype === 'string' && typeof value !== 'string') {
      return
    }

    if (value.length > compiledOptions.maxLength) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
        maxLength: compiledOptions.maxLength,
      })
    }
  },
}

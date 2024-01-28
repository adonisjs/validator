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

const DEFAULT_MESSAGE = 'number validation failed'
const RULE_NAME = 'number'

/**
 * Ensure the value is a valid number. Numeric string will be casted
 * to valid numbers
 */
export const number: SyncValidation = {
  compile: wrapCompile(RULE_NAME),
  validate(value, _, { mutate, errorReporter, pointer, arrayExpressionPointer }) {
    if (typeof value === 'number') {
      return
    }

    /**
     * Report error when value is not a number and neither a string
     */
    if (typeof value !== 'string') {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    /**
     * Attempt to cast number like string to a number. In case of
     * failure report the validation error
     */
    const castedValue = Number(value)
    if (Number.isNaN(castedValue)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    if (castedValue === Number.POSITIVE_INFINITY || castedValue === Number.NEGATIVE_INFINITY) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    if (castedValue === Number.POSITIVE_INFINITY || castedValue === Number.NEGATIVE_INFINITY) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    /**
     * Mutate the value
     */
    mutate(castedValue)
  },
}

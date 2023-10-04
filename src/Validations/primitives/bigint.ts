/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'bigint validation failed'
const RULE_NAME = 'bigint'

/**
 * Ensure the value is a valid bigint. Numeric string will be casted
 * to valid bigint
 */
export const bigint: SyncValidation = {
  compile: wrapCompile(RULE_NAME),
  validate(value, _, { mutate, errorReporter, pointer, arrayExpressionPointer }) {
    if (typeof value === 'bigint') {
      return
    }

    /**
     * Report error when value is not a bigint and neither a string or a number
     */
    if (typeof value !== 'string' && typeof value !== 'number') {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    /**
     * Attempt to cast string or number to a bigint. In case of
     * failure report the validation error
     */
    try {
      const castedValue = BigInt(value)

      /**
       * Mutate the value
       */
      mutate(castedValue)
    } catch (e) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

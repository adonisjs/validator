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

const RULE_NAME = 'array'
const DEFAULT_MESSAGE = 'array validation failed'

/**
 * Ensure value is a valid array
 */
export const array: SyncValidation = {
  compile: wrapCompile(RULE_NAME),
  validate(value, _, { pointer, arrayExpressionPointer, errorReporter }) {
    if (!Array.isArray(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

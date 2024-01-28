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

const RULE_NAME = 'nullable'
const DEFAULT_MESSAGE = 'nullable validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const nullable: SyncValidation = {
  compile: wrapCompile(RULE_NAME, [], () => {
    return {
      allowUndefineds: true,
    }
  }),
  validate(value, _, { errorReporter, pointer, arrayExpressionPointer }) {
    if (value === undefined || value === '') {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

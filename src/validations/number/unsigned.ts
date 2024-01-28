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

const RULE_NAME = 'unsigned'
const DEFAULT_MESSAGE = 'unsigned validation failed'

export const unsigned: SyncValidation = {
  compile: wrapCompile(RULE_NAME, ['number']),
  validate(value, _, { errorReporter, arrayExpressionPointer, pointer }) {
    if (typeof value !== 'number') {
      return
    }

    if (value < 0) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

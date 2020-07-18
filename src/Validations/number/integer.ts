/**
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'integer'
const DEFAULT_MESSAGE = 'integer validation failed'

export const integer: SyncValidation = {
  compile: wrapCompile(RULE_NAME, ['number']),
  validate (value, _, { errorReporter, arrayExpressionPointer, pointer }) {
    if (typeof (value) !== 'number') {
      return
    }

    if (!Number.isInteger(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

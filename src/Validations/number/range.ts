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

const RULE_NAME = 'range'
const DEFAULT_MESSAGE = 'range validation failed'

export const range: SyncValidation<{ start: number, stop: number}> = {
  compile: wrapCompile(RULE_NAME, ['number'], ([start, stop]) => {
    if(typeof (start) !== 'number') {
      throw new Error(`The start value for "${RULE_NAME}" must be defined as number`)
    }
    if(typeof (stop) !== 'number') {
      throw new Error(`The stop value for "${RULE_NAME}" must be defined as number`)
    }
    if(start > stop) {
      throw new Error(`The start value for "${RULE_NAME}" must be lower than the stop value`)
    }

    return {
      compiledOptions: {
        start,
        stop,
      },
    }
  }),
  validate (value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (typeof (value) !== 'number') {
      return
    }

    if(value < compiledOptions.start || value > compiledOptions.stop) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {...compiledOptions})
    }
  },
}

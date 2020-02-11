/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'maxLength validation failed'

export const maxLength: SyncValidation<{ maxLength: number }> = {
  compile (_, subtype, limit) {
    if (!['string', 'array'].includes(subtype)) {
      throw new Error(`Cannot use maxLength rule on "${subtype}" data type.`)
    }

    if (typeof (limit) !== 'number') {
      throw new Error('The limit value for maxLength must be defined as a number.')
    }

    return {
      allowUndefineds: false,
      async: false,
      name: 'maxLength',
      compiledOptions: { maxLength: limit },
    }
  },
  validate (value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (typeof (value) !== 'string' && !Array.isArray(value)) {
      return
    }

    if (value.length > compiledOptions.maxLength) {
      errorReporter.report(pointer, 'maxLength', DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
    }
  },
}

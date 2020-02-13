/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { getFieldValue } from '../../utils'

const DEFAULT_MESSAGE = 'requiredIfExistsAll validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const requiredIfExistsAll: SyncValidation<{ fields: string[] }> = {
  compile (_, __, options) {
    /**
     * Ensure "fields" are defined
     */
    if (!options || !options.fields) {
      throw new Error('requiredIfExistsAll: expects an array "fields"')
    }

    /**
     * Ensure "fields" is an array
     */
    if (!Array.isArray(options.fields)) {
      throw new Error('requiredIfExistsAll: expects "fields" to be an array')
    }

    return {
      allowUndefineds: true,
      async: false,
      name: 'requiredIfExistsAll',
      compiledOptions: { fields: options.fields },
    }
  },
  validate (
    value,
    compiledOptions,
    { root, tip, errorReporter, pointer, arrayExpressionPointer },
  ) {
    const allFieldsExists = compiledOptions.fields.every((field) => {
      const otherFieldValue = getFieldValue(field, root, tip)
      return otherFieldValue !== undefined && otherFieldValue !== null
    })

    if (allFieldsExists && !value && value !== false && value !== 0) {
      errorReporter.report(pointer, 'requiredIfExistsAll', DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

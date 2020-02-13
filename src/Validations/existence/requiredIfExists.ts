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

const DEFAULT_MESSAGE = 'requiredIfExists validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const requiredIfExists: SyncValidation<{ field: string }> = {
  compile (_, __, options) {
    /**
     * Ensure "field" is defined
     */
    if (!options || !options.field) {
      throw new Error('requiredIfExists: expects a "field"')
    }

    return {
      allowUndefineds: true,
      async: false,
      name: 'requiredIfExists',
      compiledOptions: { field: options.field },
    }
  },
  validate (
    value,
    compiledOptions,
    { root, tip, errorReporter, pointer, arrayExpressionPointer },
  ) {
    const otherFieldValue = getFieldValue(compiledOptions.field, root, tip)
    const otherFieldExists = otherFieldValue !== undefined && otherFieldValue !== null

    if (otherFieldExists && !value && value !== false && value !== 0) {
      errorReporter.report(pointer, 'requiredIfExists', DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

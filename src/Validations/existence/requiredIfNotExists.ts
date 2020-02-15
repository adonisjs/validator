/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { getFieldValue, ensureValidArgs } from '../../utils'
import { exists } from '../../Validator/helpers'

const RULE_NAME = 'requiredIfNotExists'
const DEFAULT_MESSAGE = 'requiredIfNotExists validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const requiredIfNotExists: SyncValidation<{ field: string }> = {
  compile (_, __, args) {
    ensureValidArgs(RULE_NAME, args)
    const [field] = args

    /**
     * Ensure "field" is defined
     */
    if (!field) {
      throw new Error(`${RULE_NAME}: expects a "field"`)
    }

    return {
      allowUndefineds: true,
      async: false,
      name: RULE_NAME,
      compiledOptions: { field },
    }
  },
  validate (
    value,
    compiledOptions,
    { root, tip, errorReporter, pointer, arrayExpressionPointer },
  ) {
    const otherFieldValue = getFieldValue(compiledOptions.field, root, tip)
    const otherFieldMissing = !exists(otherFieldValue)

    if (otherFieldMissing && !exists(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

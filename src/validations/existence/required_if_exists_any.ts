/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'
import { exists, getFieldValue, wrapCompile } from '../../validator/helpers.js'

const RULE_NAME = 'requiredIfExistsAny'
const DEFAULT_MESSAGE = 'requiredIfExistsAny validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const requiredIfExistsAny: SyncValidation<{ fields: string[] }> = {
  compile: wrapCompile(RULE_NAME, [], ([fields]) => {
    if (!fields) {
      throw new Error(`"${RULE_NAME}": expects an array of "fields"`)
    }

    if (!Array.isArray(fields)) {
      throw new Error(`"${RULE_NAME}": expects "fields" to be an array`)
    }

    return {
      allowUndefineds: true,
      compiledOptions: {
        fields,
      },
    }
  }),
  validate(value, compiledOptions, { root, tip, errorReporter, pointer, arrayExpressionPointer }) {
    const anyFieldExists = compiledOptions.fields.find((field) => {
      const otherFieldValue = getFieldValue(field, root, tip)
      return exists(otherFieldValue)
    })

    if (anyFieldExists && !exists(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
        otherFields: compiledOptions.fields,
      })
    }
  },
}

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { exists, getFieldValue, wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'requiredIfExistsAll'
const DEFAULT_MESSAGE = 'requiredIfExistsAll validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const requiredIfExistsAll: SyncValidation<{ fields: string[] }> = {
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
    const allFieldsExists = compiledOptions.fields.every((field) => {
      const otherFieldValue = getFieldValue(field, root, tip)
      return exists(otherFieldValue)
    })

    if (allFieldsExists && !exists(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
        otherFields: compiledOptions.fields,
      })
    }
  },
}

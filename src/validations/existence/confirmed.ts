/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'
import { exists, getFieldValue, wrapCompile, resolveAbsoluteName } from '../../validator/helpers.js'

const RULE_NAME = 'confirmed'
const DEFAULT_MESSAGE = 'confirmed validation failed'

/**
 * Ensures that the field value has been confirmed using `{{field}}_confirmation` field.
 * Useful for password confirmation.
 */
export const confirmed: SyncValidation = {
  compile: wrapCompile(RULE_NAME, ['string', 'boolean', 'number', 'enum'], (args: any[]) => {
    const res = {
      compiledOptions: {
        confirmationFieldName: args[0],
      },
    }

    return res
  }),
  validate(
    value,
    { confirmationFieldName },
    { errorReporter, field, pointer, arrayExpressionPointer, root, tip }
  ) {
    if (!exists(value)) {
      return
    }

    confirmationFieldName = confirmationFieldName || `${field}_confirmation`

    /**
     * We check to same value is not the type. Since it's possible that the original
     * value is casted using a sub rule like `number`. However, the confirmed
     * value is still a string.
     *
     * For example:
     * age: schema.number([ rules.confirmed() ])
     *
     * Over HTTP the `age` and the `age_confirmation` field will both be strings. However,
     * the `number` rule will cast the `age` to a number. So the type check with the
     * confirmed rule will fail.
     */
    // eslint-disable-next-line eqeqeq
    if (getFieldValue(confirmationFieldName, root, tip) != value) {
      errorReporter.report(
        resolveAbsoluteName(confirmationFieldName, pointer),
        RULE_NAME,
        DEFAULT_MESSAGE,
        arrayExpressionPointer
      )
    }
  },
}

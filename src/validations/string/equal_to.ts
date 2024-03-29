/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'
import { wrapCompile, isRef } from '../../validator/helpers.js'

const RULE_NAME = 'equalTo'
const DEFAULT_MESSAGE = 'equalTo validation failed'

type CompileReturnType = { fieldValue?: string; ref?: string }

/**
 * Validation signature for the "equalTo". Non-string values are
 * ignored.
 */
export const equalTo: SyncValidation<CompileReturnType> = {
  compile: wrapCompile<CompileReturnType>(RULE_NAME, ['string'], ([equalToValue], _) => {
    if (isRef(equalToValue)) {
      return {
        compiledOptions: { ref: equalToValue.key },
      }
    }

    if (!equalToValue || typeof equalToValue !== 'string') {
      throw new Error(`The "${RULE_NAME}" rule expects equalToValue to be a string`)
    }

    return {
      compiledOptions: { fieldValue: equalToValue },
    }
  }),
  validate(value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer, refs }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof value !== 'string') {
      return
    }

    let fieldValue

    if (compiledOptions.ref) {
      const runtimeFieldValue = refs[compiledOptions.ref].value
      fieldValue = runtimeFieldValue
    } else if (compiledOptions.fieldValue) {
      fieldValue = compiledOptions.fieldValue
    }

    if (value !== fieldValue) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

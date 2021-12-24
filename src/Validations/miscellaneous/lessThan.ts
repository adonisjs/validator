/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile, isRef } from '../../Validator/helpers'

const RULE_NAME = 'lessThan'
const DEFAULT_MESSAGE = 'lessThan validation failed'

type CompileReturnType = { fieldValue?: string; ref?: string }

/**
 * Validation signature for the "lessThan".
 */
export const lessThan: SyncValidation<CompileReturnType> = {
  compile: wrapCompile<CompileReturnType>(RULE_NAME, [], ([lessThanValue], _) => {
    if (isRef(lessThanValue)) {
      return {
        compiledOptions: { ref: lessThanValue.key },
      }
    }

    if (!lessThanValue) {
      throw new Error(`The "${RULE_NAME}" rule expects lessThanValue`)
    }

    return {
      compiledOptions: { fieldValue: lessThanValue },
    }
  }),
  validate(value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer, refs }) {
    let fieldValue

    if (compiledOptions.ref) {
      const runtimeFieldValue = refs[compiledOptions.ref].value
      fieldValue = runtimeFieldValue
    } else if (compiledOptions.fieldValue) {
      fieldValue = compiledOptions.fieldValue
    }

    if (value < fieldValue) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

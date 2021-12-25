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

const RULE_NAME = 'greaterThan'
const DEFAULT_MESSAGE = 'greaterThan validation failed'

type CompileReturnType = { fieldValue?: string; ref?: string }

/**
 * Validation signature for the "greaterThan".
 */
export const greaterThan: SyncValidation<CompileReturnType> = {
  compile: wrapCompile<CompileReturnType>(RULE_NAME, [], ([greaterThanValue], _) => {
    if (isRef(greaterThanValue)) {
      return {
        compiledOptions: { ref: greaterThanValue.key },
      }
    }

    if (!greaterThanValue) {
      throw new Error(`The "${RULE_NAME}" rule expects greaterThanValue`)
    }

    return {
      compiledOptions: { fieldValue: greaterThanValue },
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

    if (value > fieldValue) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

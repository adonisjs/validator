/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile, enforceArray, isRef } from '../../Validator/helpers'

const RULE_NAME = 'enum'
const DEFAULT_MESSAGE = 'enum validation failed'

/**
 * Return type of the compile function
 */
type CompileReturnType = { choices?: any[]; ref?: string }

/**
 * Ensure the value is one of the defined choices
 */
export const oneOf: SyncValidation<CompileReturnType> = {
  compile: wrapCompile<CompileReturnType>(RULE_NAME, [], ([choices]) => {
    /**
     * Choices are defined as a ref
     */
    if (isRef(choices)) {
      return {
        compiledOptions: { ref: choices.key },
      }
    }

    /**
     * Ensure value is an array or a ref
     */
    if (!choices || !Array.isArray(choices)) {
      throw new Error(`"${RULE_NAME}": expects an array of choices or a "ref"`)
    }

    return { compiledOptions: { choices: choices } }
  }),
  validate(value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer, refs }) {
    let choices: any[] = []

    /**
     * Resolve choices from the ref or use as it is, if defined as an array
     */
    if (compiledOptions.ref) {
      const runtimeChoices = refs[compiledOptions.ref].value
      enforceArray(
        runtimeChoices,
        `"${RULE_NAME}": expects "refs.${compiledOptions.ref}" to be an array`
      )
      choices = runtimeChoices
    } else if (compiledOptions.choices) {
      choices = compiledOptions.choices
    }

    /**
     * Validation
     */
    if (!choices.includes(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, { choices })
    }
  },
}

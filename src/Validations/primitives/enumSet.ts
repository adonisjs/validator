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

const RULE_NAME = 'enumSet'
const DEFAULT_MESSAGE = 'enumSet validation failed'

/**
 * Return type of the compile function
 */
type CompileReturnType = { choices?: any[], ref?: string }

/**
 * Ensure the input array is a subset of defined choices
 */
export const enumSet: SyncValidation<CompileReturnType> = {
  compile: wrapCompile<CompileReturnType>(RULE_NAME, [], ([ choices ]) => {
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
  validate (value, compiledOptions, { errorReporter, pointer, refs, arrayExpressionPointer }) {
    /**
     * Ensure user defined value is an array
     */
    if (!Array.isArray(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
      return
    }

    let choices: any[] = []

    /**
     * Resolve choices from the ref or use as it is, if defined as an array
     */
    if (compiledOptions.ref) {
      const runtimeChoices = refs[compiledOptions.ref].value
      enforceArray(runtimeChoices, `"${RULE_NAME}": expects "refs.${compiledOptions.ref}" to be an array`)
      choices = runtimeChoices
    } else if (compiledOptions.choices) {
      choices = compiledOptions.choices
    }

    /**
     * Ensure user defined values fall within the choices array
     */
    if (!value.every((one) => choices.includes(one))) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, { choices })
    }
  },
}

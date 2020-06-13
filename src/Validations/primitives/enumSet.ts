/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'enumSet validation failed'
const RULE_NAME = 'enumSet'
const CHOICES_ERROR_MESSAGE = `The "${RULE_NAME}" rule expects an array of choices or a value reference`

function ensureChoicesAreArray (choices: unknown): asserts choices is any[] {
  if (!Array.isArray(choices)) {
    throw new Error(CHOICES_ERROR_MESSAGE)
  }
}

/**
 * Ensure the input array is a subset of defined choices
 */
export const enumSet: SyncValidation<{ choices: any[] | { key: string } }> = {
  compile: wrapCompile(RULE_NAME, [], ([ choices ]) => {
    if (!choices || (!Array.isArray(choices) && !choices.__$isRef)) {
      throw new Error(
        `The "${RULE_NAME}" rule expects an array of choices or a value reference`,
      )
    }

    if (choices.__$isRef) {
      choices = {
        key: choices.key,
      }
    }

    return {
      compiledOptions: {
        choices,
      },
    }
  }),
  validate (value, compiledOptions, { errorReporter, pointer, refs, arrayExpressionPointer }) {
    if (!Array.isArray(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
      return
    }

    let choices = compiledOptions.choices
    if (!Array.isArray(choices)) {
      const runtimeChoices = refs[choices.key].value
      ensureChoicesAreArray(runtimeChoices)
      choices = runtimeChoices
    }

    if (!value.every((one) => (choices as any[]).includes(one))) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, { choices })
    }
  },
}

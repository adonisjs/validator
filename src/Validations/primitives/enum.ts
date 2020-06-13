/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { ensureValidArgs } from '../../Validator/helpers'

const RULE_NAME = 'enum'
const DEFAULT_MESSAGE = 'enum validation failed'
const CHOICES_ERROR_MESSAGE = `The "${RULE_NAME}" rule expects an array of choices or a value reference`

function ensureChoicesAreArray (choices: unknown): asserts choices is any[] {
  if (!Array.isArray(choices)) {
    throw new Error(CHOICES_ERROR_MESSAGE)
  }
}

/**
 * Ensure the value is one of the defined choices
 */
export const oneOf: SyncValidation<{ choices: any[] | { key: string } }> = {
  compile (_, __, args) {
    ensureValidArgs(RULE_NAME, args)

    /**
     * The first argument is an array of choices
     */
    let [choices] = args
    if (!choices || (!Array.isArray(choices) && !choices.__$isRef)) {
      throw new Error(
        `The "${RULE_NAME}" rule expects an array of choices or a value reference`,
      )
    }

    /**
     * Pick key from the choices object. We ignore the value and
     * read it at the runtime.
     */
    if (choices.__$isRef) {
      choices = {
        key: choices.key,
      }
    }

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: { choices },
    }
  },
  validate (value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer, refs }) {
    let choices = compiledOptions.choices

    if (!Array.isArray(choices)) {
      const runtimeChoices = refs[choices.key].value
      ensureChoicesAreArray(runtimeChoices)
      choices = runtimeChoices
    }

    if (!choices.includes(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, { choices })
    }
  },
}

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

const DEFAULT_MESSAGE = 'enum validation failed'
const RULE_NAME = 'enum'

/**
 * Ensure the value is one of the defined choices
 */
export const oneOf: SyncValidation<{ choices: any[] }> = {
  compile (_, __, args) {
    ensureValidArgs(RULE_NAME, args)

    /**
     * The first argument is an array of choices
     */
    const [choices] = args
    if (!choices || !Array.isArray(choices)) {
      throw new Error(`The "${RULE_NAME}" rule expects an array of choices`)
    }

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: { choices },
    }
  },
  validate (value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (!compiledOptions.choices.includes(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
    }
  },
}

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'enumSet validation failed'

/**
 * Ensure the input array is a subset of defined choices
 */
export const enumSet: SyncValidation<{ choices: any[] }> = {
  compile (_, __, options) {
    if (!options || !options.choices || !Array.isArray(options.choices)) {
      throw new Error('The "enumSet" rule expects an array of choices')
    }

    return {
      allowUndefineds: false,
      async: false,
      name: 'enumSet',
      compiledOptions: { choices: options.choices },
    }
  },
  validate (value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (!Array.isArray(value)) {
      errorReporter.report(pointer, 'enumSet', DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
      return
    }

    if (!value.every((one) => compiledOptions.choices.includes(one))) {
      errorReporter.report(pointer, 'enumSet', DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
    }
  },
}

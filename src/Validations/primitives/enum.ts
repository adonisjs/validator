/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

const DEFAULT_MESSAGE = 'enum validation failed'

/**
 * Ensure the value is one of the defined choices
 */
export const oneOf: SyncValidation<{ choices: any[] }> = {
  compile (_, __, options) {
    if (!options || !options.choices || !Array.isArray(options.choices)) {
      throw new Error('The "enum" rule expects an array of choices')
    }

    return {
      allowUndefineds: false,
      async: false,
      name: 'enum',
      compiledOptions: { choices: options.choices },
    }
  },
  validate (value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (!compiledOptions.choices.includes(value)) {
      errorReporter.report(pointer, 'enum', DEFAULT_MESSAGE, arrayExpressionPointer, compiledOptions)
    }
  },
}

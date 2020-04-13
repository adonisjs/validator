/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import isIP from 'validator/lib/isIP'
import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { ensureValidArgs } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'ip validation failed'
const RULE_NAME = 'ip'

/**
 * Validation signature for the "ip" regex. Non-string values are
 * ignored.
 */
export const ip: SyncValidation<{ version?: '4' | '6' }> = {
  compile (_, subtype, args) {
    if (subtype !== 'string') {
      throw new Error(`Cannot use ip rule on "${subtype}" data type.`)
    }

    ensureValidArgs(RULE_NAME, args)
    const options = args[0]

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: {
        version: options && options.version,
      },
    }
  },
  validate (value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof (value) !== 'string') {
      return
    }

    if (!isIP(value, compiledOptions.version)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

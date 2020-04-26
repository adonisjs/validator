/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import isUUID, { UUIDVersion } from 'validator/lib/isUUID'
import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { ensureValidArgs } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'uuid validation failed'
const RULE_NAME = 'uuid'

/**
 * Validation signature for the "uuid" rule. Non-string values are
 * ignored.
 */
export const uuid: SyncValidation<{ version?: UUIDVersion }> = {
  compile (_, subtype, args) {
    if (subtype !== 'string') {
      throw new Error(`Cannot use ${RULE_NAME} rule on "${subtype}" data type.`)
    }

    ensureValidArgs(RULE_NAME, args)
    const options = args[0]

    return {
      allowUndefineds: false,
      async: false,
      name: RULE_NAME,
      compiledOptions: {
        version: options && options.version || 4,
      },
    }
  },
  validate (value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignor non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof (value) !== 'string') {
      return
    }

    if (!isUUID(value, compiledOptions.version)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

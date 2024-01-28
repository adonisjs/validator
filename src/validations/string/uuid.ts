/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import validatorJs from 'validator'

import { SyncValidation } from '../../types.js'
import { wrapCompile } from '../../validator/helpers.js'

const DEFAULT_MESSAGE = 'uuid validation failed'
const RULE_NAME = 'uuid'

/**
 * Validation signature for the "uuid" rule. Non-string values are
 * ignored.
 */
export const uuid: SyncValidation<{ version?: validatorJs.UUIDVersion }> = {
  compile: wrapCompile(RULE_NAME, ['string'], ([options]) => {
    return {
      compiledOptions: {
        version: options && options.version ? options.version : 4,
      },
    }
  }),
  validate(value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignor non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof value !== 'string') {
      return
    }

    if (!validatorJs.default.isUUID(value, compiledOptions.version)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

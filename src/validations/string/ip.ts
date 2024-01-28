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

const RULE_NAME = 'ip'
const DEFAULT_MESSAGE = 'ip validation failed'

/**
 * Validation signature for the "ip" regex. Non-string values are
 * ignored.
 */
export const ip: SyncValidation<{ version?: 4 | 6 }> = {
  compile: wrapCompile(RULE_NAME, ['string'], ([options]) => {
    let version = options && options.version
    if (version && typeof version === 'string') {
      version = Number(version)
    }

    return {
      compiledOptions: {
        version: version,
      },
    }
  }),
  validate(value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string
     */
    if (typeof value !== 'string') {
      return
    }

    if (!validatorJs.default.isIP(value, compiledOptions.version)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

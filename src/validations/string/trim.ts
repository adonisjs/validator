/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'
import { wrapCompile } from '../../validator/helpers.js'

const RULE_NAME = 'trim'

/**
 * Trim string value
 */
export const trim: SyncValidation<undefined> = {
  compile: wrapCompile(RULE_NAME, [], () => {
    return {
      name: 'trim',
      async: false,
      allowUndefineds: false,
      compiledOptions: undefined,
    }
  }),
  validate(value, _, { mutate }) {
    if (typeof value !== 'string') {
      return
    }

    mutate(value.trim())
  },
}

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import validatorJs from 'validator'

import { SyncValidation } from '../../types.js'
import { wrapCompile } from '../../validator/helpers.js'

const RULE_NAME = 'escape'

/**
 * Escape string value
 */
export const escape: SyncValidation<undefined> = {
  compile: wrapCompile(RULE_NAME, [], () => {
    return {
      name: 'escape',
      async: false,
      allowUndefineds: false,
      compiledOptions: undefined,
    }
  }),
  validate(value, _, { mutate }) {
    if (typeof value !== 'string') {
      return
    }

    mutate(validatorJs.default.escape(value))
  },
}

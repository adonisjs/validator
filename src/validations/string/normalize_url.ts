/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { default as normalize } from 'normalize-url'

import { wrapCompile } from '../../validator/helpers.js'
import { UrlNormalizationOptions, SyncValidation } from '../../types.js'

const RULE_NAME = 'normalizeUrl'

/**
 * Normalize URL
 */
export const normalizeUrl: SyncValidation<UrlNormalizationOptions> = {
  compile: wrapCompile(RULE_NAME, ['string'], (args) => {
    const options = Object.assign({}, args[0]) as UrlNormalizationOptions

    return {
      compiledOptions: options,
    }
  }),
  validate(value, compiledOptions, { mutate }) {
    /**
     * Ignore non string values
     */
    if (typeof value !== 'string') {
      return
    }

    /**
     * Normalize URL
     */
    mutate(normalize(value, compiledOptions))
  },
}

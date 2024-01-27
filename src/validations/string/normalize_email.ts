/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import validatorJs from 'validator'
import string from '@poppinss/utils/string'

import { wrapCompile } from '../../validator/helpers.js'
import { EmailNormalizationOptions, SyncValidation } from '../../types.js'

const RULE_NAME = 'normalizeEmail'

/**
 * Normalize email address
 */
export const normalizeEmail: SyncValidation<validatorJs.NormalizeEmailOptions> = {
  compile: wrapCompile(RULE_NAME, ['string'], (args) => {
    const options = Object.assign({}, args[0]) as EmailNormalizationOptions

    return {
      compiledOptions: Object.keys(options).reduce((result, key) => {
        const validatorKey = string.snakeCase(key) as keyof validatorJs.NormalizeEmailOptions
        result[validatorKey] = options[key as keyof EmailNormalizationOptions]
        return result
      }, {} as validatorJs.NormalizeEmailOptions),
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
     * Normalize email
     */
    mutate(validatorJs.default.normalizeEmail(value, compiledOptions))
  },
}

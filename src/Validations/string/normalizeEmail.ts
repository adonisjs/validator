/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { snakeCase } from '@poppinss/utils/build/src/Helpers/string'
import { SyncValidation, NormalizeEmailOptions } from '@ioc:Adonis/Core/Validator'
import {
  default as validatorJsNormalizeEmail,
  NormalizeEmailOptions as ValidatorJsOptions,
} from 'validator/lib/normalizeEmail'

import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'normalizeEmail'

/**
 * Normalize email address
 */
export const normalizeEmail: SyncValidation<ValidatorJsOptions> = {
  compile: wrapCompile(RULE_NAME, ['string'], (args) => {
    const options = Object.assign({}, args[0]) as NormalizeEmailOptions

    return {
      compiledOptions: Object.keys(options).reduce<ValidatorJsOptions>((result, key) => {
        result[snakeCase(key)] = options[key]
        return result
      }, {}),
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
     * Apply lower case sanitization
     */
    mutate(validatorJsNormalizeEmail(value, compiledOptions))
  },
}

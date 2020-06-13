/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import validator from 'validator'
import isMobilePhone from 'validator/lib/isMobilePhone'
import { SyncValidation } from '@ioc:Adonis/Core/Validator'

import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'mobile'
const DEFAULT_MESSAGE = 'mobile validation failed'

/**
 * Validation signature for the "mobile" regex. Non-string values are
 * ignored.
 */
export const mobile: SyncValidation<{ strict: boolean, locale?: validator.MobilePhoneLocale[] }> = {
  compile: wrapCompile(RULE_NAME, ['string'], ([ options ]) => {
    options = Object.assign({}, options)
    return {
      compiledOptions: {
        strict: options.strict || false,
        locale: options.locale,
      },
    }
  }),
  validate (value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string.
     */
    if (typeof (value) !== 'string') {
      return
    }

    /**
     * Invalid mobile number
     */
    if (!isMobilePhone(value, compiledOptions.locale, { strictMode: compiledOptions.strict })) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }
  },
}

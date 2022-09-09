/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import normalizeEmail, { NormalizeEmailOptions } from 'validator/lib/normalizeEmail'
import isEmail, { IsEmailOptions } from 'validator/lib/isEmail'
import { SyncValidation, EmailRuleOptions } from '@ioc:Adonis/Core/Validator'

import { isObject, wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'email'
const DEFAULT_MESSAGE = 'email validation failed'

/**
 * Shape of compiled options. It is a merged copy of
 * sanitization and validation options
 */
type CompiledOptions = IsEmailOptions & {
  sanitize?: NormalizeEmailOptions
}

/**
 * Validation signature for the "email" regex. Non-string values are
 * ignored.
 */
export const email: SyncValidation<CompiledOptions> = {
  compile: wrapCompile(RULE_NAME, ['string'], (args) => {
    const options = Object.assign(
      {
        domainSpecificValidation: false,
        allowIpDomain: false,
        ignoreMaxLength: false,
        sanitize: false,
      },
      args[0]
    ) as Required<EmailRuleOptions>

    /**
     * Compute sanitization options
     */
    let sanitizationOptions: CompiledOptions['sanitize']
    if (options.sanitize) {
      sanitizationOptions = {}
      process.emitWarning(
        'DeprecationWarning',
        'email.sanitize options are deprecated. Instead use "rules.normalizeEmail" method'
      )

      if (options.sanitize === true) {
        sanitizationOptions = {}
      } else if (isObject(options.sanitize)) {
        if (typeof options.sanitize.lowerCase === 'boolean') {
          sanitizationOptions.all_lowercase = options.sanitize.lowerCase
        }

        if (typeof options.sanitize.removeDots === 'boolean') {
          sanitizationOptions.gmail_remove_dots = options.sanitize.removeDots
        }

        if (typeof options.sanitize.removeSubaddress === 'boolean') {
          Object.assign(sanitizationOptions, {
            gmail_remove_subaddress: options.sanitize.removeSubaddress,
            outlookdotcom_remove_subaddress: options.sanitize.removeSubaddress,
            yahoo_remove_subaddress: options.sanitize.removeSubaddress,
            icloud_remove_subaddress: options.sanitize.removeSubaddress,
          })
        }
      }
    }

    return {
      compiledOptions: {
        allow_display_name: options.allowDisplayName,
        require_display_name: options.requireDisplayName,
        allow_utf8_local_part: options.allowUtf8LocalPart,
        require_tld: options.requireTld,
        ignore_max_length: options.ignoreMaxLength,
        allow_ip_domain: options.allowIpDomain,
        domain_specific_validation: options.domainSpecificValidation,
        sanitize: sanitizationOptions,
      },
    }
  }),
  validate(value, compiledOptions, { errorReporter, arrayExpressionPointer, pointer, mutate }) {
    /**
     * Ignore non-string values. The user must apply string rule
     * to validate string.
     */
    if (typeof value !== 'string') {
      return
    }

    /**
     * Invalid email
     */
    if (!isEmail(value, compiledOptions)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    /**
     * Apply lower case sanitization
     */
    if (isObject(compiledOptions.sanitize)) {
      mutate(normalizeEmail(value, compiledOptions.sanitize))
    }
  },
}

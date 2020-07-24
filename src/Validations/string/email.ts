/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import { SyncValidation, EmailRuleOptions } from '@ioc:Adonis/Core/Validator'

import { isObject, wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'email'
const DEFAULT_MESSAGE = 'email validation failed'

/**
 * Shape of compiled options. It is a merged copy of
 * sanitization and validation options
 */
type CompiledOptions = Parameters<typeof isEmail>[1] & {
	sanitize?: {
		all_lowercase: boolean
	}
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
			if (options.sanitize === true) {
				sanitizationOptions = { all_lowercase: true }
			} else if (isObject(options.sanitize)) {
				sanitizationOptions = { all_lowercase: options.sanitize.lowerCase }
			}
		}

		return {
			compiledOptions: {
				domain_specific_validation: options.domainSpecificValidation,
				allow_ip_domain: options.allowIpDomain,
				ignore_max_length: options.ignoreMaxLength,
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
		if (compiledOptions.sanitize?.all_lowercase) {
			mutate(normalizeEmail(value, compiledOptions.sanitize))
		}
	},
}

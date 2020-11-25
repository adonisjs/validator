/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import normalizeUrl from 'normalize-url'
import isUrl, { IsURLOptions } from 'validator/lib/isURL'
import { SyncValidation, UrlRuleOptions } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'url'
const DEFAULT_MESSAGE = 'url validation failed'

/**
 * Shape of compiled options
 */
type CompiledOptions = {
	sanitizationOptions: {
		normalizeProtocol?: boolean
		stripWWW?: boolean
	}
	validationOptions: IsURLOptions
}

/**
 * Validation signature for the "email" regex. Non-string values are
 * ignored.
 */
export const url: SyncValidation<CompiledOptions> = {
	compile: wrapCompile(RULE_NAME, ['string'], (args) => {
		const options = Object.assign({}, args[0]) as UrlRuleOptions

		return {
			/**
			 * The defaults should match the given options
			 * https://github.com/validatorjs/validator.js/blob/master/src/lib/isURL.js#L21
			 */
			compiledOptions: {
				validationOptions: {
					protocols: options.protocols || ['http', 'https', 'ftp'],
					require_tld: options.requireTld === false ? false : true,
					require_protocol: options.requireProtocol === true ? true : false,
					require_host: options.requireHost === false ? false : true,
					require_valid_protocol: !!(options.protocols && options.protocols.length),
					validate_length: options.validateLength === false ? false : true,
					...(options.hostWhitelist ? { host_whitelist: options.hostWhitelist } : {}),
					...(options.hostBlacklist ? { host_blacklist: options.hostBlacklist } : {}),
				},
				sanitizationOptions: {
					normalizeProtocol:
						options.ensureProtocol === true || typeof options.ensureProtocol === 'string'
							? true
							: false,
					defaultProtocol: `${
						typeof options.ensureProtocol === 'string' ? options.ensureProtocol : 'http'
					}:`,
					stripWWW: options.stripWWW === true ? true : false,
					sortQueryParameters: false,
				},
			},
		}
	}),
	validate(
		value,
		{ validationOptions, sanitizationOptions },
		{ errorReporter, arrayExpressionPointer, pointer, mutate }
	) {
		/**
		 * Ignore non-string values. The user must apply string rule
		 * to validate string.
		 */
		if (typeof value !== 'string') {
			return
		}

		/**
		 * Invalid url
		 */
		if (!isUrl(value, validationOptions)) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
			return
		}

		/**
		 * Do not perform normalization until one of the options are set to true. If we add
		 * more configuration options, then maybe we can get rid of this conditional
		 * all together.
		 */
		if (sanitizationOptions.normalizeProtocol || sanitizationOptions.stripWWW) {
			mutate(normalizeUrl(value, sanitizationOptions))
		}
	},
}

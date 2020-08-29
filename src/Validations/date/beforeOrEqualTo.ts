/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { compile, validate, CompileReturnType } from './helpers/compare'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'beforeOrEqualTo'
const DEFAULT_MESSAGE = 'before or equal to date validation failed'

/**
 * Ensure the value is one of the defined choices
 */
export const beforeOrEqualTo: SyncValidation<CompileReturnType> = {
	compile: wrapCompile<CompileReturnType>(RULE_NAME, ['date'], (options: any[]) => {
		return compile(RULE_NAME, '<=', options)
	}),
	validate(value, compiledOptions, runtimeOptions) {
		return validate(RULE_NAME, DEFAULT_MESSAGE, value, compiledOptions, runtimeOptions)
	},
}

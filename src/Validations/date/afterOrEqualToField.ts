/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

import { wrapCompile } from '../../Validator/helpers'
import { compile, validate, CompileReturnType } from './helpers/field'

const RULE_NAME = 'afterOrEqualToField'
const DEFAULT_MESSAGE = 'after or equal to date validation failed'

/**
 * Ensure the date is after the defined field.
 */
export const afterOrEqualToField: SyncValidation<CompileReturnType> = {
  compile: wrapCompile(RULE_NAME, [], (options, _, __, rulesTree) => {
    return compile(RULE_NAME, '>=', options, rulesTree)
  }),
  validate(value, compiledOptions, runtimeOptions) {
    return validate(RULE_NAME, DEFAULT_MESSAGE, value, compiledOptions, runtimeOptions)
  },
}

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'

import { wrapCompile } from '../../validator/helpers.js'
import { compile, validate, CompileReturnType } from './helpers/field.js'

const RULE_NAME = 'beforeField'
const DEFAULT_MESSAGE = 'before date validation failed'

/**
 * Ensure the date is after the defined field.
 */
export const beforeField: SyncValidation<CompileReturnType> = {
  compile: wrapCompile(RULE_NAME, [], (options, _, __, rulesTree) => {
    return compile(RULE_NAME, '<', options, rulesTree)
  }),
  validate(value, compiledOptions, runtimeOptions) {
    return validate(RULE_NAME, DEFAULT_MESSAGE, value, compiledOptions, runtimeOptions)
  },
}

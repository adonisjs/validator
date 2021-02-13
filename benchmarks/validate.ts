/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CompilerOutput } from '@ioc:Adonis/Core/Validator'

import * as validations from '../src/Validations'
import { MessagesBag } from '../src/MessagesBag'
import { exists, isObject } from '../src/Validator/helpers'
import { VanillaErrorReporter } from '../src/ErrorReporter/Vanilla'
const helpers = { exists, isObject }

export function validate(fn: CompilerOutput<any>, data: any) {
  return fn(data, validations, new VanillaErrorReporter(new MessagesBag({}), true), helpers, {})
}

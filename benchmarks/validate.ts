/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CompilerOutput } from '../src/types.js'

import validations from '../src/validations/index.js'
import { MessagesBag } from '../src/messages_bag/index.js'
import { exists, isObject } from '../src/validator/helpers.js'
import { VanillaErrorReporter } from '../src/error_reporter/vanilla.js'

const helpers = { exists, isObject }

export function validate(fn: CompilerOutput<any>, data: any) {
  return fn(data, validations, new VanillaErrorReporter(new MessagesBag({}), true), helpers, {})
}

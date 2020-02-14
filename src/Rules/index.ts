/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { Rules, Rule } from '@ioc:Adonis/Core/Validator'
import * as validations from '../Validations'

/**
 * Returns a function that can be used to target
 * validations
 */
export function getRuleFn (name: string) {
  return function ruleFn (...args: any): Rule {
    return { name, options: args }
  }
}

/**
 * A key value pair to define a rule on a given field
 */
const rules = Object.keys(validations).reduce((result, name) => {
  result[name] = getRuleFn(name)
  return result
}, {} as Rules)

export { rules }

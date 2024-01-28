/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Rules, Rule } from '../types.js'
import validations from '../validations/index.js'

/**
 * Returns a function that can be used to target
 * validations
 */
export function getRuleFn(name: string) {
  return function ruleFn(...args: any): Rule {
    return { name, options: args[0] === undefined ? [] : args }
  }
}

/**
 * A key value pair to define a rule on a given field
 */
const rules: Rules = Object.keys(validations).reduce((result, name) => {
  result[name as keyof Rules] = getRuleFn(name)
  return result
}, {} as Rules)

export { rules }

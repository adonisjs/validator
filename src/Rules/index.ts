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
 * A key value pair to define a rule on a given field
 */
const rules = Object.keys(validations).reduce((result, name) => {
  result[name] = function rule (options?: any): Rule {
    return { name, options }
  }
  return result
}, {} as Rules)

export { rules }

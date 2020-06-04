/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { lodash } from '@poppinss/utils'

/**
 * Ensure value is not `undefined`
 */
export function existsStrict (value: any) {
  return value !== undefined && value !== null
}

/**
 * Ensure that value exists. Empty string, null and undefined
 * fails the exists check.
 */
export function exists (value: any) {
  return !!value || value === false || value === 0
}

/**
 * Ensure value is a valid Object. Returns false for `Array` and `null`
 */
export function isObject (value: any) {
  return value !== null && typeof (value) === 'object' && !Array.isArray(value)
}

/**
 * Returns the field value for a given pointer. If pointer starts
 * with `/`, then it will be searched from the root of the
 * object, otherwise it's searched from the nearest tip
 */
export function getFieldValue (field: string, root: any, tip: any) {
  return field[0] === '/' ? lodash.get(root, field.slice(1)) : tip[field]
}

/**
 * Validates to ensure that arguments passed to validations compile method
 * is an array
 */
export function ensureValidArgs (ruleName: string, args: any): asserts args is any[] {
  /**
   * The compile method must receive an array of spread arguments. If not
   * it means the end has not used `Rules.<rule>` in order to use the
   * validation rule
   */
  if (!Array.isArray(args)) {
    throw new Error(`${ruleName}: The 3rd argument must be a combined array of arguments`)
  }
}

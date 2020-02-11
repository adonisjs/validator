/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * Ensure value is not `undefined`
 */
export function defined (value: any) {
  return value !== undefined
}

/**
 * Ensure value is not `undefined` and neither `null`
 */
export function existy (value: any) {
  return value !== null && value !== undefined
}

/**
 * Ensure value is a valid Object. Returns false for `Array` and `null`
 */
export function isObject (value: any) {
  return value !== null && typeof (value) === 'object' && !Array.isArray(value)
}

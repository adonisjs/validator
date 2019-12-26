/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/// <reference path="../../adonis-typings/index.ts" />

import { validateAll, validate } from '@ioc:Adonis/Core/Validator'
import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'

/**
 * Extends the request class by adding custom `validate` and
 * `validateUsing` methods
 */
export default function extendRequest (
  Request: RequestConstructorContract,
  validateFn: typeof validate,
  validateAllFn: typeof validateAll,
): void {
  /**
   * Adding `validate` macro to validate the current request
   * data
   */
  Request.macro('validate', function requestValidate (
    schema,
    messages?,
    config?,
  ): Promise<any> {
    return validateFn(this.all(), schema, messages, config)
  })

  /**
   * Adding `validate` macro to validate using custom data. This is shortcut
   * import validator manually
   */
  Request.macro('validateAll', function requestValidateAll (
    schema,
    messages?,
    config?,
  ): Promise<any> {
    return validateAllFn(this.all(), schema, messages, config)
  })
}

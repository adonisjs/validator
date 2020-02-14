/*
* @adonisjs/ace
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'
import { validator, ErrorReporterConstructorContract } from '@ioc:Adonis/Core/Validator'
import * as ErrorReporters from '../ErrorReporter'

/**
 * Extends the request class by adding `validate` method
 * to it
 */
export default function extendRequest (
  Request: RequestConstructorContract,
  validate: typeof validator['validate'],
) {
  Request.macro('validate', function validateRequest (schema: any, messages?: any, config?: any) {
    /**
     * Attempt to find the best error reporter for validation
     */
    let Reporter: ErrorReporterConstructorContract = ErrorReporters.VanillaErrorReporter
    if (this.accepts(['json']) === 'json') {
      Reporter = ErrorReporters.ApiErrorReporter
    }

    if (this.accepts(['application/vnd.api+json']) === 'application/vnd.api+json') {
      Reporter = ErrorReporters.JsonApiErrorReporter
    }

    return validate(schema, {
      ...this.all(),
      ...this.allFiles(),
    }, messages, Object.assign({ reporter: Reporter }, config))
  })
}

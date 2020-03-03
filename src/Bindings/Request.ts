/*
* @adonisjs/validator
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
  Request.macro('validate', async function validateRequest (validatorNode) {
    let Reporter: ErrorReporterConstructorContract

    /**
     * Attempt to find the best error reporter for validation
     */
    switch (this.accepts(['html', 'application/vnd.api+json', 'json'])) {
      case 'html':
      case null:
        Reporter = ErrorReporters.VanillaErrorReporter
        break
      case 'json':
        Reporter = ErrorReporters.ApiErrorReporter
        break
      case 'application/vnd.api+json':
        Reporter = ErrorReporters.JsonApiErrorReporter
        break
    }

    /**
     * Merging request body, files and the params. The params are nested, since
     * it's possible that request body and params may have the same object
     * properties.
     */
    const data = { ...this.all(), ...this.allFiles(), params: this.ctx!.params }

    /**
     * Creating a new profiler action to profile the validation
     */
    const profilerAction = this.ctx!.profiler.profile('request:validate')

    try {
      const validated = await validate({ data, reporter: Reporter, ...validatorNode })
      profilerAction.end({ status: 'success' })
      return validated
    } catch (error) {
      profilerAction.end({ status: 'error' })
      throw error
    }
  })
}

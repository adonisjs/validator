/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Validation exception raised by the error reporters. The handle method is called
 * automatically during an HTTP request by AdonisJS to self handle the exception
 */
export class ValidationException extends Exception {
  constructor(public flashToSession: boolean, public messages?: any) {
    super('Validation Exception', 422, 'E_VALIDATION_FAILURE')
  }

  /**
   * Handle exception.
   */
  public async handle(error: ValidationException, ctx: HttpContextContract) {
    /**
     * Return the error messages as it is when `flashToSession` is explicitly disabled
     * or session module is not installed
     */
    if (!error.flashToSession || !ctx['session']) {
      return ctx.response.status(error.status).send(error.messages)
    }

    const session = ctx['session']

    /**
     * Flash all input, except the `_csrf`.
     */
    session.flashExcept(['_csrf', '_method'])

    /**
     * Flash errors
     */
    ctx['session'].flash('errors', error.messages)

    /**
     * Redirect back with the query string
     */
    ctx.response.redirect('back', true)
  }
}

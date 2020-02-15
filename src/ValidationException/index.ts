/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@poppinss/utils'

/**
 * Validation exception to self handle and send response
 */
export class ValidationException extends Exception {
  constructor (public flashToSession: boolean, public messages?: any) {
    super('Validation Exception', 422, 'E_VALIDATION_FAILURE')
  }

  public async handle (error: ValidationException, ctx: HttpContextContract) {
    if (!error.flashToSession || !ctx['session']) {
      return ctx.response.status(error.status).send(error.messages)
    }

    const session = ctx['session']

    /**
     * Flash all input, except the `_csrf_token`.
     */
    session.flashExcept(['_csrf_token'])

    /**
     * Flash errors
     */
    ctx['session'].flash('errors', error.messages)

    ctx.response.redirect('back', true)
  }
}

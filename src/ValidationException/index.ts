/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Validation exception to self handle and send response
 */
export class ValidationException {
  constructor (public flashToSession: boolean, public messages?: any) {}

  public async handle (error: ValidationException, ctx: HttpContextContract) {
    if (!error.flashToSession || !ctx['session']) {
      return ctx.response.status(422).send(error.messages)
    }

    const session = ctx['session']
    session.flashExcept(['_csrf_token'])
    ctx['session'].flash('errors', error.messages)
    ctx.response.redirect('back', true)
  }
}

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
 * Raised when validation fails
 */
export class ValidationException extends Exception {
  constructor (public messages: any[]) {
    super('Validation failure', 422)
  }

  /**
   * Makes a JSON response
   */
  private makeJsonResponse (error: ValidationException, { response }: HttpContextContract): void {
    response.status(error.status).send({ errors: error.messages })
  }

  /**
   * Flash error messages and form values and redirect the user
   * back
   */
  private flashAndRedirect (error: ValidationException, ctx: HttpContextContract): void {
    /**
     * Do not flash csrf token
     */
    ctx['session'].flashExcept(['_csrf_token'])

    /**
     * Flash error messages as an object of field names and an array
     * of messages
     */
    ctx['session'].flash('errors', error.messages.reduce((result, message) => {
      result[message.field] = result[message.field] || []
      result[message.field].push(message.message)
      return result
    }, {}))

    /**
     * Redirect back
     */
    ctx.response.redirect('back', true)
  }

  /**
   * Make plain text response
   */
  private makePlainTextResponse (error: ValidationException, ctx: HttpContextContract): void {
    ctx.response.status(error.status).send(error.messages.map(({ message }) => message).join('\n'))
  }

  /**
   * Handle exception and make response
   */
  public handle (error: ValidationException, ctx: HttpContextContract): void {
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      this.makeJsonResponse(error, ctx)
      return
    }

    if (ctx['session']) {
      this.flashAndRedirect(error, ctx)
      return
    }

    this.makePlainTextResponse(error, ctx)
  }
}

'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const GE = require('@adonisjs/generic-exceptions')

/**
 * Exception to throw when validation fails
 *
 * @class ValidationException
 */
class ValidationException extends GE.RuntimeException {
  static validationFailed (messages) {
    const error = new this('Validation failed', 400, 'E_VALIDATION_FAILED')
    error.messages = messages
    return error
  }

  /* istanbul ignore next */
  /**
   * Handle the validation failed exception
   *
   * @method handle
   *
   * @param  {Array} options.messages
   * @param  {Object} options.request
   * @param  {Object} options.response
   * @param  {Object} options.session
   *
   * @return {void}
   */
  async handle ({ messages }, { request, response, session }) {
    const isJSON = request.accepts(['html', 'json']) === 'json'

    /**
     * If request is json then send json response
     */
    if (isJSON) {
      return response.status(400).send(messages)
    }

    /**
     * If session provider exists, then flash errors back to the
     * actual page
     */
    if (session && session.withErrors) {
      session.withErrors(messages).flashAll()
      await session.commit()
      response.redirect('back')
      return
    }

    /**
     * Otherwise do the dumbest thing and send a 400
     * with plain message
     */
    response
      .status(400)
      .send('Validation failed. Make sure you have filled all fields correctly')
  }
}

module.exports = { ValidationException }

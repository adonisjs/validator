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
}

module.exports = { ValidationException }

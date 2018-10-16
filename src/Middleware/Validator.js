'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { resolver } = require('@adonisjs/fold')
const _ = require('lodash')
const CE = require('../Exceptions')

/**
 * The middleware to validate requests using a custom
 * validator.
 *
 * This middleware is wrapped inside `Route.validator()` method
 * which automatically pushes this middleware in the route
 * middleware stack
 *
 * @namespace Adonis/Middleware/ValidatorMiddleware
 *
 * @class ValidatorMiddleware
 * @constructor
 */
class ValidatorMiddleware {
  constructor (Validator) {
    this.Validator = Validator
  }

  /**
   * Sanitize user data based upon validator sanitization
   * rules
   *
   * @method _sanitizeData
   *
   * @param  {Object}      request
   * @param  {Object}      validatorInstance
   *
   * @return {void}
   *
   * @private
   */
  _sanitizeData (request, validatorInstance) {
    /**
     * Skip sanitization when there are no rules defined
     */
    if (!validatorInstance.sanitizationRules || !_.size(validatorInstance.sanitizationRules)) {
      return true
    }

    const qsData = request.get()
    const sanitizedQSData = this.Validator.sanitize(qsData, validatorInstance.sanitizationRules)

    const data = request.post()
    const sanitizedData = this.Validator.sanitize(data, validatorInstance.sanitizationRules)

    /**
     * Here we mutate the actual request body and query params, this is required since there is
     * no point keep the actual data when we really want to sanitize it.
     */
    request._qs = _.merge({}, qsData, sanitizedQSData)
    request.body = _.merge({}, data, sanitizedData)
  }

  /**
   * Runs validations on the current request data using
   * the validator instance.
   *
   * @method _runValidations
   * @async
   *
   * @param  {Object}        ctx
   * @param  {Object}        validatorInstance
   *
   * @return {Boolean}
   *
   * @throws {ValidationException} If validation fails and there is no `fails` method
   *                               on the validatorInstance
   *
   * @private
   */
  async _runValidations (request, validatorInstance) {
    /**
     * Skip validation when there are no rules
     * defined
     */
    if (!validatorInstance.rules || !_.size(validatorInstance.rules)) {
      return true
    }

    /**
     * The validation method to be used. If there is a
     * property called `validateAll` on the validator
     * instance, then validateAll otherwise not.
     *
     * @type {Function}
     */
    const validate = validatorInstance.validateAll
      ? this.Validator.validateAll
      : this.Validator.validate

    let data = validatorInstance.data

    /**
     * Merge request body and files when custom data object is
     * not defined
     */
    if (!data) {
      const files = typeof (request.files) === 'function' ? request.files() : {}
      data = Object.assign({}, request.all(), files)
    }

    /**
     * Run validations
     */
    const validation = await validate(
      data,
      validatorInstance.rules,
      validatorInstance.messages,
      validatorInstance.formatter
    )

    /**
     * Validation passed
     */
    if (!validation.fails()) {
      return true
    }

    /**
     * If validator has a method to handle messages, then
     * call the method.
     */
    if (typeof (validatorInstance.fails) === 'function') {
      await validatorInstance.fails(validation.messages())
      return false
    }

    /**
     * Finally throw the validation messages
     *
     * @type {Error}
     */
    throw CE.ValidationException.validationFailed(validation.messages())
  }

  /**
   * Calls the validator authorize method when it exists
   *
   * @method _authorize
   *
   * @param  {Object}   validatorInstance
   *
   * @return {Boolean}
   *
   * @private
   */
  _authorize (validatorInstance) {
    if (typeof (validatorInstance.authorize) !== 'function') {
      return true
    }
    return validatorInstance.authorize()
  }

  /**
   * Ends the response when it's pending and the end-user
   * has not made any response so far.
   *
   * @method _endResponseIfCan
   *
   * @param  {Object}          response
   * @param  {String}          message
   * @param  {Number}          status
   *
   * @return {void}
   *
   * @private
   */
  _endResponseIfCan (response, message, status) {
    if ((!response.lazyBody.content || !response.lazyBody.method) && response.isPending) {
      response.status(status).send(message)
    }
  }

  /**
   * Handle method executed by adonis middleware chain
   *
   * @method handle
   *
   * @param  {Object}   ctx
   * @param  {Function} next
   * @param  {Array}   validator
   *
   * @return {void}
   */
  async handle (ctx, next, validator) {
    validator = validator instanceof Array === true ? validator[0] : validator

    if (!validator) {
      throw new Error('Cannot validate request without a validator. Make sure to call Route.validator(\'validatorPath\')')
    }

    const validatorInstance = resolver.forDir('validators').resolve(validator)

    /**
     * Set request ctx on the validator
     */
    validatorInstance.ctx = ctx

    /**
     * Sanitize request data if there are sanitization rules
     */
    this._sanitizeData(ctx.request, validatorInstance)

    /**
     * Validate the request. This method should handle the request
     * response, since the middleware chain has been stopped.
     *
     * If this method doesn't handles the response, then a generic
     * response is made
     *
     * @type {void}
     */
    const validate = await this._runValidations(ctx.request, validatorInstance)
    if (!validate) {
      this._endResponseIfCan(ctx.response, 'Validation failed. Make sure to handle it inside validator.fails method', 400)
      return
    }

    /**
     * Authorize the request. This method should return true to
     * authorize the request.
     *
     * Make response or throw an exception to reject the request.
     *
     * Returning false from the method will result in a generic
     * error message
     */
    const authorized = await this._authorize(validatorInstance)
    if (!authorized) {
      this._endResponseIfCan(ctx.response, 'Unauthorized request. Make sure to handle it inside validator.authorize method', 401)
      return
    }

    /**
     * All good, so continue
     */
    await next()
  }
}

module.exports = ValidatorMiddleware

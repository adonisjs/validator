'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const { ServiceProvider } = require('@adonisjs/fold')

class ValidationProvider extends ServiceProvider {
  /**
   * Register the validator to the IoC container
   * with `Adonis/Addons/Validator` namespace.
   *
   * @method _registerValidator
   *
   * @return {void}
   *
   * @private
   */
  _registerValidator () {
    this.app.bind('Adonis/Addons/Validator', () => require('../src/Validator'))
    this.app.alias('Adonis/Addons/Validator', 'Validator')
  }

  /**
   * Register the middleware to the IoC container
   * with `Adonis/Middleware/Validator` namespace
   *
   * @method _registerMiddleware
   *
   * @return {void}
   *
   * @private
   */
  _registerMiddleware () {
    this.app.bind('Adonis/Middleware/Validator', (app) => {
      const MiddlewareValidator = require('../src/Middleware/Validator')
      return new MiddlewareValidator(app.use('Adonis/Addons/Validator'))
    })
  }

  /**
   * Register bindings
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this._registerValidator()
    this._registerMiddleware()
  }

  /**
   * On boot
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    /**
     * Add exception handler to handle exception gracefully.
     */
    const Exception = this.app.use('Adonis/Src/Exception')
    Exception.handle('ValidationException', require('../src/ExceptionHandler'))

    /**
     * Define a named middleware with server
     *
     * @type {String}
     */
    const Server = this.app.use('Adonis/Src/Server')
    Server.registerNamed({
      addonValidator: 'Adonis/Middleware/Validator'
    })

    /**
     * Extend route class by adding a macro, which pushes a
     * middleware to the route middleware stack and
     * validates the request via validator
     * class
     */
    const Route = this.app.use('Adonis/Src/Route')
    Route.Route.macro('validator', function (validatorClass) {
      this.middleware([`addonValidator:${validatorClass}`])
    })
  }
}

module.exports = ValidationProvider

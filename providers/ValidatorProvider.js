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
  register () {
    this.app.bind('Adonis/Addons/Validator', () => require('../src/Validator'))
    this.app.alias('Adonis/Addons/Validator', 'Validator')
  }

  boot () {
    const Route = this.app.use('Adonis/Src/Route')
    const Server = this.app.use('Adonis/Src/Server')

    /**
     * Define a named middleware with server
     *
     * @type {String}
     */
    Server.registerNamed({
      addonValidator: 'Adonis/Middleware/Validator'
    })

    /**
     * Extend route class by adding a macro, which pushes a
     * middleware to the route middleware stack and
     * validates the request via validator
     * class
     */
    Route.Route.macro('validator', function (validatorClass) {
      this.middleware([`addonValidator:${validatorClass}`])
    })
  }
}

module.exports = ValidationProvider

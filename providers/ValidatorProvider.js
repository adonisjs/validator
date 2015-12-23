'use strict'

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const ServiceProvider = require('adonis-fold').ServiceProvider

class ValidatorProvider extends ServiceProvider {
  * register () {
    this.app.singleton('Adonis/Addons/Validator', function () {
      return require('../src/Validator')
    })
  }
}

module.exports = ValidatorProvider

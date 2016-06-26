'use strict'

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const ServiceProvider = require('adonis-fold').ServiceProvider
const ExtendedRules = require('../src/ExtendedRules')

class ValidatorProvider extends ServiceProvider {
  * register () {
    this.app.singleton('Adonis/Addons/Validator', function (app) {
      const Database = app.use('Adonis/Src/Database')
      const extendedRules = new ExtendedRules(Database)
      const validator = require('../src/Validator')
      validator.extend('unique', extendedRules.unique.bind(extendedRules), '{{field}} has already been taken by someone else')
      return validator
    })
  }
}

module.exports = ValidatorProvider

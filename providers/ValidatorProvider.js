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
      const validator = require('../src/Validator')
      /**
       * Wrap database unique rule inside a try/catch block
       * incase someone is not using Lucid
       */
      try {
        const Database = app.use('Adonis/Src/Database')
        const extendedRules = new ExtendedRules(Database)
        validator.extend('unique', extendedRules.unique.bind(extendedRules), '{{field}} has already been taken by someone else')
      } catch (e) {}
      return validator
    })
  }
}

module.exports = ValidatorProvider

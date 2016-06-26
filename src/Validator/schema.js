'use strict'

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const Indicative = require('indicative')

class SchemaValidator {

  constructor () {
    this.errors = []
  }

  /**
   * @description validate schema using indicative validate
   * and returns on first error
   * @method validate
   * @param  {Object} data
   * @param  {Object} rules
   * @param  {Object} messages
   * @return {Promise}
   * @public
   */
  validate (data, rules, messages) {
    let self = this
    return new Promise(function (resolve, reject) {
      Indicative
        .validate(data, rules, messages)
        .then(function (success) {
          self.errors = []
          resolve(self)
        })
        .catch(function (error) {
          self.errors = error
          resolve(self)
        })
    })
  }

  /**
   * @description validate schema using indicative validate
   * @method validateAll
   * @param  {Object} data
   * @param  {Object} rules
   * @param  {Object} messages
   * @return {Promise}
   * @public
   */
  validateAll (data, rules, messages) {
    let self = this
    return new Promise(function (resolve, reject) {
      Indicative
        .validateAll(data, rules, messages)
        .then(function (success) {
          self.errors = []
          resolve(self)
        })
        .catch(function (error) {
          self.errors = error
          resolve(self)
        })
    })
  }

  /**
   * @description tells whether there was an error using validate method
   * or not
   * @method fails
   * @return {Boolean}
   * @public
   */
  fails () {
    return !!this.errors.length
  }

  /**
   * @description returns error messages
   * @method messages
   * @return {Array}
   * @public
   */
  messages () {
    return this.errors
  }
}

module.exports = SchemaValidator

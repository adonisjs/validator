"use strict";

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const Indicative = new(require("indicative"))
const _ = require("lodash")

class Validator {

  constructor() {
    this.errors = [];
  }


  /**
   * @function validate
   * @description validate schema using indicative validate
   * and returns on first error
   * @param  {Object} rules
   * @param  {Object} data
   * @param  {Object} messages
   * @return {Promise}
   * @public
   */
  * validate(rules, data, messages) {
    let self = this;
    return new Promise(function(resolve, reject) {
      Indicative
        .validate(rules, data, messages)
        .then(function(success) {
          self.errors = [];
          resolve();
        })
        .catch(function(error) {
          self.errors = error;
          resolve();
        });
    });
  }


  /**
   * @function validateAll
   * @description validate schema using indicative validate
   * @param  {Object} rules
   * @param  {Object} data
   * @param  {Object} messages
   * @return {Promise}
   * @public
   */
  * validateAll(rules, data, messages) {
    let self = this;
    return new Promise(function(resolve, reject) {
      Indicative
        .validateAll(rules, data, messages)
        .then(function(success) {
          self.errors = [];
          resolve();
        })
        .catch(function(error) {
          self.errors = error;
          resolve();
        });
    });
  }


  /**
   * @function fails
   * @description tells whether there was an error using validate method
   * or not
   * @return {Boolean}
   * @public
   */
  fails() {
    return _.size(this.errors) ? true : false;
  }

  /**
   * @function messages
   * @description returns error messages
   * @return {Array}
   * @public
   */
  messages() {
    return this.errors;
  }


  /**
   * @function extend
   * @description adds new methods to indicative lib
   * @param  {String} rule
   * @param  {Function} method
   * @param  {String} message
   * @public
   */
  extend(rule, method, message) {
    Indicative.extend(rule, message, method);
  }

}


module.exports = Validator;

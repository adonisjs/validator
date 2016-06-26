'use strict'

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const indicative = require('indicative')
const Validator = exports = module.exports = {}
const SchemaValidator = require('./schema')

/**
 * assigning indicative methods to the Validator
 * object.
 */
Validator.extend = indicative.extend
Validator.sanitize = indicative.sanitize
Validator.sanitizor = indicative.sanitizor
Validator.is = indicative.is

/**
 * @description returns a new instance of schema validator class
 * and calls its validate method
 * @method validate
 * @param  {Object} data
 * @param  {Object} rules
 * @param  {Obbject} messages
 * @return {Object}
 * @public
 */
Validator.validate = function (data, rules, messages) {
  return new SchemaValidator().validate(data, rules, messages)
}

/**
 * @description returns a new instance of schema validator class
 * and calls its validateAll method
 * @method validateAll
 * @param  {Object} data
 * @param  {Object} rules
 * @param  {Obbject} messages
 * @return {Object}
 * @public
 */
Validator.validateAll = function (data, rules, messages) {
  return new SchemaValidator().validateAll(data, rules, messages)
}

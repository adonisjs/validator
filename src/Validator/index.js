'use strict'

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const Indicative = require('indicative')
const Validator = exports = module.exports = {}
const SchemaValidator = require('./schema')

/**
 * @description adds new methods to indicative lib
 * @method extend
 * @param  {String} rule
 * @param  {Function} method
 * @param  {String} message
 * @public
 */
Validator.extend = function (rule, method, message) {
  Indicative.extend(rule, method, message)
}

/**
 * @description returns a new instance of schema validator class
 * and calls its validate method
 * @method validate
 * @param  {Object} rules
 * @param  {Object} data
 * @param  {Obbject} messages
 * @return {Object}
 * @public
 */
Validator.validate = function (rules, data, messages) {
  return new SchemaValidator().validate(rules, data, messages)
}

/**
 * @description returns a new instance of schema validator class
 * and calls its validateAll method
 * @method validateAll
 * @param  {Object} rules
 * @param  {Object} data
 * @param  {Obbject} messages
 * @return {Object}
 * @public
 */
Validator.validateAll = function (rules, data, messages) {
  return new SchemaValidator().validateAll(rules, data, messages)
}

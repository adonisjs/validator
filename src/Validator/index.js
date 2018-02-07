'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const indicative = require('indicative')

const Validation = require('../Validation')
const { ValidationException, InvalidArgumentException } = require('../Exceptions')

module.exports = {
  validateAll: (...params) => new Validation(...params).runAll(),
  validate: (...params) => new Validation(...params).run(),
  sanitize: (...params) => indicative.sanitize(...params),
  rule: indicative.rule,
  is: indicative.is,
  sanitizor: indicative.sanitizor,
  configure: indicative.configure,
  formatters: indicative.formatters,
  extend: function (rule, fn) {
    if (typeof (fn) !== 'function') {
      throw InvalidArgumentException.invalidParameter('Validator.extend expects 2nd parameter to be a function', fn)
    }
    indicative.validations[rule] = fn
  },
  ValidationException
}

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

module.exports = {
  validateAll: (...params) => new Validation(...params).runAll(),
  validate: (...params) => new Validation(...params).run(),
  sanitize: (...params) => indicative.sanitize(...params),
  rule: indicative.rule,
  is: indicative.is,
  sanitizor: indicative.sanitizor,
  extend: indicative.extend
}

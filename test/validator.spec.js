'use strict'

/* global describe,it */

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const Validator = require('../src/Validator')
const ExtendedRules = require('../src/ExtendedRules')
const chai = require('chai')
const clone = require('clone')
const expect = chai.expect
require('co-mocha')
const Database = {
  whereNotCalled: false,
  table: function (table) {
    return this
  },
  pluck: function (field) {
    return new Promise((resolve, reject) => {
      if (this.whereNotCalled) {
        resolve()
      } else {
        resolve(['ssksk@gmail.com'])
      }
    })
  },
  where: function (field, value) {
    return this
  },

  whereNot: function () {
    this.whereNotCalled = true
    return this
  }
}

describe('Validator', function () {
  it('should validate data schema and return appropriate errors', function * () {
    let rules = {
      username: 'required'
    }
    let data = {}
    const validate = yield Validator.validate(data, rules)
    expect(validate.fails()).to.equal(true)
    expect(validate.messages()[0].validation).to.equal('required')
  })

  it('should not return previous errors when validation is passed next time', function * () {
    let rules = {
      username: 'required'
    }
    let data = {
      username: 'boom'
    }
    const validate = yield Validator.validate(data, rules)
    expect(validate.fails()).to.equal(false)
  })

  it('should return all errors at once , when using validateAll', function * () {
    let rules = {
      username: 'required',
      email: 'required'
    }

    let data = {
    }

    const validate = yield Validator.validateAll(data, rules)
    const messages = validate.messages()
    let fields = []
    expect(validate.fails()).to.equal(true)
    expect(messages).to.have.length(2)

    messages.forEach(function (message) {
      fields.push(message.field)
    })
    expect(fields).deep.equal(['username', 'email'])
  })

  it('should return errors to false, when data satisfy rules using validateAll', function * () {
    let rules = {
      username: 'required',
      email: 'required'
    }

    let data = {
      username: 'bar',
      email: 'foo'
    }
    const validate = yield Validator.validateAll(data, rules)
    expect(validate.fails()).to.equal(false)
  })

  it('should extend indicative using extend method', function * () {
    var nums = function (data, field, message, args) {
      return new Promise(function (resolve, reject) {
        if (!data[field]) {
          resolve()
          return
        }
        if (typeof (data[field]) === 'number') {
          resolve()
          return
        }
        reject(message)
      })
    }

    Validator.extend('nums', nums, 'Enter a valid number')
    const rules = {
      age: 'required|nums'
    }
    const data = {
      age: '20'
    }
    const validate = yield Validator.validate(data, rules)
    expect(validate.fails()).to.equal(true)
    expect(validate.messages()[0].message).to.equal('Enter a valid number')
  })

  it('should be able to call raw validations using is method', function () {
    const isArray = Validator.is.array
    expect(typeof (isArray)).to.equal('function')
  })

  it('should be able to extend raw validations', function () {
    Validator.is.extend('fooBar', function () {})
    const isFooBar = Validator.is.fooBar
    expect(typeof (isFooBar)).to.equal('function')
  })

  it('should be able to call sanitize method', function () {
    const sanitize = Validator.sanitize
    expect(typeof (sanitize)).to.equal('function')
  })

  it('should be able to access raw sanitizor', function () {
    const title = Validator.sanitizor.title('hello-world')
    expect(title).to.equal('Hello World')
  })

  it('should throw an error when field already exists', function * () {
    const extendedRules = new ExtendedRules(Database)
    Validator.extend('unique', extendedRules.unique.bind(extendedRules), '{{field}} has already been taken by someone else')
    const rules = {
      email: 'unique:users'
    }
    const data = {
      email: 'sdjsajkdaksj@gmail.com'
    }
    const validate = yield Validator.validate(data, rules)
    expect(validate.fails()).to.equal(true)
    expect(validate.messages()[0].message).to.equal('email has already been taken by someone else')
  })

  it('should work fine when field does not exists', function * () {
    const DbClone = clone(Database)
    DbClone.pluck = function () {
      return new Promise((resolve) => {
        resolve()
      })
    }
    const extendedRules = new ExtendedRules(DbClone)
    Validator.extend('unique', extendedRules.unique.bind(extendedRules), '{{field}} has already been taken by someone else')
    const rules = {
      email: 'unique:users'
    }
    const data = {
      email: 'sdjsajkdaksj@gmail.com'
    }
    const validate = yield Validator.validate(data, rules)
    expect(validate.fails()).to.equal(false)
  })

  it('should pass validation when whereNot key/value pairs are availabe', function * () {
    const extendedRules = new ExtendedRules(Database)
    Validator.extend('unique', extendedRules.unique.bind(extendedRules), '{{field}} has already been taken by someone else')
    const rules = {
      email: 'unique:users,email,id,1'
    }
    const data = {
      email: 'sdjsajkdaksj@gmail.com'
    }
    const validate = yield Validator.validate(data, rules)
    expect(validate.fails()).to.equal(false)
  })
})

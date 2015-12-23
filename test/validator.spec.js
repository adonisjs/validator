'use strict'

/* global describe,it */

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const Validator = require('../src/Validator')
const chai = require('chai')
const expect = chai.expect
require('co-mocha')

describe('Validator', function () {
  it('should validate data schema and return appropriate errors', function * () {
    let schema = {
      username: 'required'
    }
    let data = {}
    const validate = yield Validator.validate(schema, data)
    expect(validate.fails()).to.equal(true)
    expect(validate.messages()[0].validation).to.equal('required')
  })

  it('should not return previous errors when validation is passed next time', function * () {
    let schema = {
      username: 'required'
    }
    let data = {
      username: 'boom'
    }
    const validate = yield Validator.validate(schema, data)
    expect(validate.fails()).to.equal(false)
  })

  it('should return all errors at once , when using validateAll', function * () {
    let schema = {
      username: 'required',
      email: 'required'
    }

    let data = {
    }

    const validate = yield Validator.validateAll(schema, data)
    const messages = validate.messages()
    let fields = []
    expect(validate.fails()).to.equal(true)
    expect(messages).to.have.length(2)

    messages.forEach(function (message) {
      fields.push(message.field)
    })
    expect(fields).deep.equal(['username', 'email'])
  })

  it('should return errors to false ,when data satisfy rules using validateAll', function * () {
    let schema = {
      username: 'required',
      email: 'required'
    }

    let data = {
      username: 'bar',
      email: 'foo'
    }
    const validate = yield Validator.validateAll(schema, data)
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
    const schema = {
      age: 'required|nums'
    }
    const data = {
      age: '20'
    }
    const validate = yield Validator.validate(schema, data)
    expect(validate.fails()).to.equal(true)
    expect(validate.messages()[0].message).to.equal('nums validation failed on age')
  })
})

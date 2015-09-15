"use strict";

/**
 * adonis-validation-provider
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const Validator = new(require("../src/Validator"))
const co = require("co")
const chai = require("chai")
const expect = chai.expect

describe("Validator", function() {

  it("should validate data schema and return appropriate errors", function(done) {

    co(function*() {

      let schema = {
        username: 'required'
      }

      let data = {};

      yield Validator.validate(schema, data);

      expect(Validator.fails()).to.equal(true);
      expect(Validator.messages()[0].rule).to.equal("required");

    }).then(done).catch(done)

  });

  it("should not return previous errors when validation is passed next time", function(done) {

    co(function*() {

      let schema = {
        username: 'required'
      }

      let data = {
        username: 'boom'
      };

      yield Validator.validate(schema, data);
      expect(Validator.fails()).to.equal(false);

    }).then(done).catch(done)


  });


  it("should return all errors at once , when using validateAll", function(done) {

    co(function*() {

      let schema = {
        username: 'required',
        email: 'required'
      }

      let data = {
      };

      yield Validator.validateAll(schema, data);
      const messages = Validator.messages();
      let fields = []
      expect(Validator.fails()).to.equal(true);
      expect(messages).to.have.length(2);

      messages.forEach(function (message) {
        fields.push(message.field)
      })

      expect(fields).deep.equal(['username','email'])

    }).then(done).catch(done)


  });


  it("should return errors to false ,when data satisfy rules using validateAll", function(done) {

    co(function*() {

      let schema = {
        username: 'required',
        email: 'required'
      }

      let data = {
        username: 'bar',
        email: 'foo'
      };

      yield Validator.validateAll(schema, data);
      expect(Validator.fails()).to.equal(false);

    }).then(done).catch(done)


  });

  it('should extend indicative using extend method', function (done){

    var nums = function (data,field,message,args) {
      return new Promise(function (resolve,reject) {
        if(!data[field]){
          resolve()
          return
        }
        if(typeof(data[field]) === 'number'){
          resolve()
          return
        }
        reject(message)
      })
    }

    Validator.extend('nums',nums,'Enter a valid number')

    co (function *() {

      const schema = {
        age :'required|nums'
      }

      const data = {
        age : '20'
      }

      yield Validator.validate(schema, data);
      expect(Validator.fails()).to.equal(true);
      expect(Validator.messages()[0].message).to.equal('nums validation failed on age');

    }).then(done).catch(done)


  })

});

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

});

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/// <reference path="../adonis-typings/index.ts" />

import test from 'japa'
import { Socket } from 'net'
import { IncomingMessage, ServerResponse } from 'http'
import { Encryption } from '@adonisjs/encryption/build/standalone'
import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'
import { Request as BaseRequest } from '@adonisjs/http-server/build/src/Request'

import extendRequest from '../src/Bindings/Request'
import { Validator } from '../src/Validator'

const Request = BaseRequest as unknown as RequestConstructorContract
const encryption = new Encryption('verylongandrandom32charsecretkey')
const requestConfig = {
  subdomainOffset: 2,
  generateRequestId: false,
  allowMethodSpoofing: false,
  trustProxy: () => true,
}

test.group('Extend Request', () => {
  test('validate data using request', async (assert) => {
    const validator = new Validator({})
    extendRequest(Request, validator.validate, validator.validateAll)

    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const request = new Request(req, res, encryption, requestConfig)

    try {
      await request.validate(validator.schema.new({
        username: validator.schema.string(),
        age: validator.schema.number(),
      }))
    } catch (error) {
      assert.deepEqual(error.messages, [{
        field: 'username',
        message: 'required validation failed on username',
        validation: 'required',
      }])
    }
  })

  test('return validated data when validation passes', async (assert) => {
    const validator = new Validator({})
    extendRequest(Request, validator.validate, validator.validateAll)

    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const request = new Request(req, res, encryption, requestConfig)
    request.setInitialBody({ username: 'virk' })

    const validated = await request.validate(validator.schema.new({
      username: validator.schema.string(),
    }))

    assert.deepEqual(validated, { username: 'virk' })
  })

  test('validate all', async (assert) => {
    const validator = new Validator({})
    extendRequest(Request, validator.validate, validator.validateAll)

    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const request = new Request(req, res, encryption, requestConfig)

    try {
      await request.validateAll(validator.schema.new({
        username: validator.schema.string(),
        age: validator.schema.number(),
      }))
    } catch (error) {
      assert.deepEqual(error.messages, [
        {
          field: 'username',
          message: 'required validation failed on username',
          validation: 'required',
        },
        {
          field: 'age',
          message: 'required validation failed on age',
          validation: 'required',
        },
      ])
    }
  })
})

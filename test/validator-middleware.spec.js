'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const { setupResolver } = require('@adonisjs/sink')
const { ioc } = require('@adonisjs/fold')
const ValidatorMiddleware = require('../src/Middleware/Validator')
const Validator = require('../src/Validator')

test.group('Validator Middleware', (group) => {
  group.before(() => {
    setupResolver()
  })

  group.beforeEach(() => {
    ioc.restore()
  })

  test('skip validation when there are no rules', async (assert) => {
    const request = {}
    const next = function () {}

    const middleware = new ValidatorMiddleware(Validator)
    class UserValidator {}

    ioc.fake('App/Validators/User', () => new UserValidator())
    await middleware.handle({ request }, next, ['App/Validators/User'])
  })

  test('throw validation exception when there are rules', async (assert) => {
    assert.plan(1)

    const request = {
      all () {
        return {}
      }
    }
    const next = function () {}

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required'
        }
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())

    try {
      await middleware.handle({ request }, next, ['App/Validators/User'])
    } catch (error) {
      assert.deepEqual(error.messages, [{
        field: 'email',
        validation: 'required',
        message: 'required validation failed on email'
      }])
    }
  })

  test('call validateAll when validator instructs for it', async (assert) => {
    assert.plan(1)

    const request = {
      all () {
        return {}
      }
    }
    const next = function () {}

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required',
          age: 'required'
        }
      }

      get validateAll () {
        return true
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())

    try {
      await middleware.handle({ request }, next, ['App/Validators/User'])
    } catch (error) {
      assert.deepEqual(error.messages, [
        {
          field: 'email',
          validation: 'required',
          message: 'required validation failed on email'
        },
        {
          field: 'age',
          validation: 'required',
          message: 'required validation failed on age'
        }
      ])
    }
  })

  test('do not throw exception when fails method is there', async (assert) => {
    assert.plan(2)

    const request = {
      all () {
        return {}
      }
    }

    const response = {
      lazyBody: {
        content: null,
        method: null
      },
      isPending () {
        return !!this.lazyBody.content
      },
      status (status) {
        this._status = status
        return this
      },
      send (content) {
        this.lazyBody.content = content
        this.lazyBody.method = 'send'
        return this
      }
    }

    const next = function () {}

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required'
        }
      }

      fails (messages) {
        assert.deepEqual(messages, [{
          field: 'email',
          validation: 'required',
          message: 'required validation failed on email'
        }])
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())
    await middleware.handle({ request, response }, next, ['App/Validators/User'])
    assert.deepEqual(response.lazyBody, {
      content: 'Validation failed. Make sure to handle it inside validator.fails method',
      method: 'send'
    })
  })

  test('all authorize when validation passes', async (assert) => {
    let authorizedCalled = false

    const request = {
      all () {
        return {
          email: 'foo@bar.com'
        }
      }
    }

    const response = {
      lazyBody: {
        content: null,
        method: null
      },
      isPending () {
        return !!this.lazyBody.content
      },
      status (status) {
        this._status = status
        return this
      },
      send (content) {
        this.lazyBody.content = content
        this.lazyBody.method = 'send'
        return this
      }
    }

    const next = function () {}

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required'
        }
      }

      authorize () {
        authorizedCalled = true
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())
    await middleware.handle({ request, response }, next, ['App/Validators/User'])
    assert.isTrue(authorizedCalled)
  })

  test('call next when there is no authorize method and validation passes', async (assert) => {
    let authorizedCalled = false
    let nextCalled = false

    const request = {
      all () {
        return {
          email: 'foo@bar.com'
        }
      }
    }

    const response = {
      lazyBody: {
        content: null,
        method: null
      },
      isPending () {
        return !!this.lazyBody.content
      },
      status (status) {
        this._status = status
        return this
      },
      send (content) {
        this.lazyBody.content = content
        this.lazyBody.method = 'send'
        return this
      }
    }

    const next = function () {
      nextCalled = true
    }

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required'
        }
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())
    await middleware.handle({ request, response }, next, ['App/Validators/User'])
    assert.isTrue(nextCalled)
    assert.isFalse(authorizedCalled)
  })

  test('call next when authorize returns true', async (assert) => {
    let authorizedCalled = false
    let nextCalled = false

    const request = {
      all () {
        return {
          email: 'foo@bar.com'
        }
      }
    }

    const response = {
      lazyBody: {
        content: null,
        method: null
      },
      isPending () {
        return !!this.lazyBody.content
      },
      status (status) {
        this._status = status
        return this
      },
      send (content) {
        this.lazyBody.content = content
        this.lazyBody.method = 'send'
        return this
      }
    }

    const next = function () {
      nextCalled = true
    }

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required'
        }
      }

      authorize () {
        authorizedCalled = true
        return true
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())
    await middleware.handle({ request, response }, next, ['App/Validators/User'])
    assert.isTrue(nextCalled)
    assert.isTrue(authorizedCalled)
  })

  test('throw exception thrown by authorize called', async (assert) => {
    assert.plan(2)
    let nextCalled = false

    const request = {
      all () {
        return {
          email: 'foo@bar.com'
        }
      }
    }

    const response = {
      lazyBody: {
        content: null,
        method: null
      },
      isPending () {
        return !!this.lazyBody.content
      },
      status (status) {
        this._status = status
        return this
      },
      send (content) {
        this.lazyBody.content = content
        this.lazyBody.method = 'send'
        return this
      }
    }

    const next = function () {
      nextCalled = true
    }

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required'
        }
      }

      authorize () {
        throw new Error('Not allowed')
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())
    try {
      await middleware.handle({ request, response }, next, ['App/Validators/User'])
    } catch ({ message }) {
      assert.isFalse(nextCalled)
      assert.equal(message, 'Not allowed')
    }
  })

  test('make generic response when authorize returns false when leaves the request hanging', async (assert) => {
    assert.plan(2)
    let nextCalled = false

    const request = {
      all () {
        return {
          email: 'foo@bar.com'
        }
      }
    }

    const response = {
      lazyBody: {
        content: null,
        method: null
      },
      isPending () {
        return !!this.lazyBody.content
      },
      status (status) {
        this._status = status
        return this
      },
      send (content) {
        this.lazyBody.content = content
        this.lazyBody.method = 'send'
        return this
      }
    }

    const next = function () {
      nextCalled = true
    }

    const middleware = new ValidatorMiddleware(Validator)

    class UserValidator {
      get rules () {
        return {
          email: 'required'
        }
      }

      authorize () {
        return false
      }
    }

    ioc.fake('App/Validators/User', () => new UserValidator())
    await middleware.handle({ request, response }, next, ['App/Validators/User'])
    assert.isFalse(nextCalled)
    assert.equal(response.lazyBody.content, 'Unauthorized request. Make sure to handle it inside validator.authorize method')
  })

  test('throw exception when validator is missing', async (assert) => {
    assert.plan(1)
    const middleware = new ValidatorMiddleware(Validator)
    try {
      await middleware.handle({}, function () {}, [])
    } catch ({ message }) {
      assert.equal(message, `Cannot validate request without a validator. Make sure to call Route.validator('validatorPath')`)
    }
  })
})

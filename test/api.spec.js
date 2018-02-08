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
const Validator = require('../src/Validator')

test.group('Validator', () => {
  test('sanitize data', (assert) => {
    const { sanitize } = Validator
    const data = {
      email: 'foo+9@gmail.com'
    }

    const rules = {
      email: 'normalize_email'
    }

    assert.deepEqual(sanitize(data, rules), {
      email: 'foo@gmail.com'
    })
  })

  test('define rule via rule method', async (assert) => {
    const { validate, rule } = Validator
    const rules = {
      email: [rule('required')]
    }

    const validation = await validate({}, rules)
    assert.isTrue(validation.fails())
    assert.deepEqual(validation.messages(), [{
      field: 'email',
      message: 'required validation failed on email',
      validation: 'required'
    }])
  })

  test('use raw validator', async (assert) => {
    const { is } = Validator
    assert.isFalse(is.email('foo'))
  })

  test('use raw sanitizor', async (assert) => {
    const { sanitizor } = Validator
    assert.equal(sanitizor.normalizeEmail('foo+9@gmail.com'), 'foo@gmail.com')
  })

  test('add validation rules', async (assert) => {
    const { extend, validate } = Validator
    extend('foo', function () {
      return new Promise((resolve, reject) => {
        /* eslint-disable */
        reject('foo rejected')
        /* eslint-enable */
      })
    })

    const rules = {
      email: 'foo'
    }

    const validation = await validate({}, rules)
    assert.isTrue(validation.fails())
    assert.deepEqual(validation.messages(), [{
      field: 'email',
      validation: 'foo',
      message: 'foo rejected'
    }])
  })

  test('access indicative formatter', async (assert) => {
    const { formatters } = Validator
    assert.property(formatters, 'Vanilla')
    assert.property(formatters, 'JsonApi')
  })

  test('throw exception when not passing a function to extend method', (assert) => {
    const { extend } = Validator
    const fn = () => extend('foo', {})
    assert.throw(fn, 'E_INVALID_PARAMETER: Validator.extend expects 2nd parameter to be a function instead received object')
  })

  test('update formatter via configure call', async (assert) => {
    const { configure, formatters } = Validator
    configure({
      FORMATTER: formatters.JsonApi
    })

    const validation = await Validator.validate({}, { username: 'required' })
    assert.deepEqual(validation.messages(), {
      errors: [
        {
          detail: 'required validation failed on username',
          title: 'required',
          source: { pointer: 'username' }
        }
      ]
    })

    configure({
      FORMATTER: formatters.Vanilla
    })
  })
})

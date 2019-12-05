/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { Validator } from '../src/Validator'

test.group('Validator', () => {
  test('handle validation failures', async (assert) => {
    const validator = new Validator({
      username: 'required',
    })

    await validator.validate({})
    assert.isTrue(validator.hasErrors)
    assert.isFalse(validator.isValid)
    assert.isUndefined(validator.validatedData)
    assert.isTrue(validator.isValidated)

    assert.deepEqual(validator.errors, [{
      field: 'username',
      message: 'required validation failed on username',
      validation: 'required',
    }])
  })

  test('multiple calls to validate must raise an exception', async (assert) => {
    assert.plan(1)

    const validator = new Validator({
      username: 'required',
    })

    await validator.validate({})
    try {
      await validator.validate({})
    } catch ({ message }) {
      assert.equal(message, 'Cannot re-use validator instance to peform multiple validations')
    }
  })

  test('use cachekey to cache schema', async (assert) => {
    const CACHE_KEY = 'foo'

    await new Validator({ username: 'required' }, {}, CACHE_KEY).validate({})

    /**
     * This validator must fail, even if we change the schema.
     */
    const validator = new Validator({ username: 'min:8' }, {}, CACHE_KEY)
    await validator.validate({})

    assert.isTrue(validator.hasErrors)
    assert.isFalse(validator.isValid)
    assert.isUndefined(validator.validatedData)
    assert.isTrue(validator.isValidated)

    assert.deepEqual(validator.errors, [{
      field: 'username',
      message: 'required validation failed on username',
      validation: 'required',
    }])
  })

  test('extend validator', async (assert) => {
    Validator.extend('foo', {
      async: false,
      validate (): boolean {
        return false
      },
    })

    /**
     * This validator must fail, even if we change the schema.
     */
    const validator = new Validator({ username: 'foo' }, {})
    await validator.validate({})

    assert.isTrue(validator.hasErrors)
    assert.isFalse(validator.isValid)
    assert.isUndefined(validator.validatedData)
    assert.isTrue(validator.isValidated)

    assert.deepEqual(validator.errors, [{
      field: 'username',
      message: 'foo validation failed on username',
      validation: 'foo',
    }])
  })
})

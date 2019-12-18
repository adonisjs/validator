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
    assert.plan(1)
    const validator = new Validator({})

    try {
      await validator.validate({}, { username: 'required' })
    } catch (error) {
      assert.deepEqual(error.messages, [{
        field: 'username',
        message: 'required validation failed on username',
        validation: 'required',
      }])
    }
  })

  test('use cachekey to cache schema', async (assert) => {
    assert.plan(2)

    const CACHE_KEY = 'foo'
    const validator = new Validator({})

    try {
      await validator.validate({}, { username: 'required' }, {}, { cacheKey: CACHE_KEY })
    } catch (error) {
      assert.deepEqual(error.messages, [{
        field: 'username',
        message: 'required validation failed on username',
        validation: 'required',
      }])
    }

    /**
     * Even though schema has changed, the old schema is used because
     * of same cache key
     */
    try {
      await validator.validate({}, { username: 'min:8' }, {}, { cacheKey: CACHE_KEY })
    } catch (error) {
      assert.deepEqual(error.messages, [{
        field: 'username',
        message: 'required validation failed on username',
        validation: 'required',
      }])
    }
  })

  test('extend validator', async (assert) => {
    assert.plan(1)

    const validator = new Validator({})
    validator.extend('foo', {
      async: false,
      validate (): boolean {
        return false
      },
    })

    try {
      await validator.validate({}, { username: 'foo' })
    } catch (error) {
      assert.deepEqual(error.messages, [{
        field: 'username',
        message: 'foo validation failed on username',
        validation: 'foo',
      }])
    }
  })

  test('define declarative schema', async (assert) => {
    assert.plan(1)
    const validator = new Validator({})

    try {
      await validator.validate({}, validator.schema.schema({ username: validator.schema.string() }))
    } catch (error) {
      assert.deepEqual(error.messages, [{
        field: 'username',
        message: 'required validation failed on username',
        validation: 'required',
      }])
    }
  })
})


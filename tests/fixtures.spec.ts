/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { validator } from '../src/validator/index.js'
import * as userProfile from '../fixtures/user_profile/schema.js'

const fixtures = [userProfile]

test.group('Fixtures', () => {
  fixtures.forEach((fixture) => {
    test(fixture.title(), async ({ assert }) => {
      for (let usecase of fixture.useCases()) {
        if (usecase.fails) {
          try {
            await validator.validate({
              schema: fixture.schema(),
              data: usecase.data,
            })
          } catch (error) {
            assert.deepEqual(usecase.errors, error.messages)
          }
        } else {
          const returnValue = await validator.validate({
            schema: fixture.schema(),
            data: usecase.data,
          })
          assert.deepEqual(usecase.output as any, returnValue)
        }
      }
    })
  })
})

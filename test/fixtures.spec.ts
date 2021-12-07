/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'

import { validator as validatorType } from '@ioc:Adonis/Core/Validator'
import { validator as validatorBase } from '../src/Validator'
import * as userProfile from '../fixtures/user-profile/schema'

const validator = validatorBase as unknown as typeof validatorType

const fixtures = [userProfile]

test.group('Fixtures', () => {
  fixtures.forEach((fixture) => {
    test(fixture.title(), async (assert) => {
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

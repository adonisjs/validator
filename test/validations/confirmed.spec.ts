/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'

import { rules } from '../../src/Rules'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { confirmed } from '../../src/Validations/existence/confirmed'

function compile () {
  return confirmed.compile('literal', 'string', rules.confirmed().options)
}

test.group('Confirmed', () => {
  test('ignore validation when original value is missing', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when original value is present and confirmation field is missing', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'password_confirmation',
        rule: 'confirmed',
        message: 'confirmed validation failed',
      }],
    })
  })

  test('report error when both fields are present but has different value', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {
        password_confirmation: 'supersecret',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'password_confirmation',
        rule: 'confirmed',
        message: 'confirmed validation failed',
      }],
    })
  })

  test('work fine when field values are same', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {
        password_confirmation: 'secret',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report when using nested fields', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'user.password',
      tip: {
        password_confirmation: 'supersecret',
      },
      root: {
        user: {
          password_confirmation: 'supersecret',
        },
      },
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'user.password_confirmation',
        rule: 'confirmed',
        message: 'confirmed validation failed',
      }],
    })
  })

  test('work fine when matches inside nested fields', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'user.password',
      tip: {
        password_confirmation: 'secret',
      },
      root: {
        user: {
          password_confirmation: 'secret',
        },
      },
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

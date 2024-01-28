/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { rules } from '../../src/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { confirmed } from '../../src/validations/existence/confirmed.js'

function compile(fieldName?: string) {
  return confirmed.compile('literal', 'string', rules.confirmed(fieldName).options, {})
}

test.group('Confirmed', () => {
  test('ignore validation when original value is missing', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when original value is present and confirmation field is missing', ({
    assert,
  }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'password_confirmation',
          rule: 'confirmed',
          message: 'confirmed validation failed',
        },
      ],
    })
  })

  test('report error when both fields are present but has different value', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {
        password_confirmation: 'supersecret',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'password_confirmation',
          rule: 'confirmed',
          message: 'confirmed validation failed',
        },
      ],
    })
  })

  test('work fine when field values are same', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {
        password_confirmation: 'secret',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report when using nested fields', ({ assert }) => {
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
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'user.password_confirmation',
          rule: 'confirmed',
          message: 'confirmed validation failed',
        },
      ],
    })
  })

  test('work fine when matches inside nested fields', ({ assert }) => {
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
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('define custom confirmation field name', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile('passwordConfirmation').compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {
        passwordConfirmation: 'secret',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('return error when custom confirmation field name is missing', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile('passwordConfirmation').compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'password',
      tip: {
        password_confirmation: 'secret',
      },
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'passwordConfirmation',
          rule: 'confirmed',
          message: 'confirmed validation failed',
        },
      ],
    })
  })

  test('return error when custom confirmation field name is missing inside nested object', ({
    assert,
  }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile('passwordConfirmation').compiledOptions, {
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
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'user.passwordConfirmation',
          rule: 'confirmed',
          message: 'confirmed validation failed',
        },
      ],
    })
  })

  test('return error when custom confirmation field name is missing at root level', ({
    assert,
  }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile('/passwordConfirmation').compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'user.password',
      tip: {
        password_confirmation: 'secret',
      },
      root: {
        password_confirmation: 'secret',
      },
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'passwordConfirmation',
          rule: 'confirmed',
          message: 'confirmed validation failed',
        },
      ],
    })
  })

  test('work fine when custom confirmation field name is present at root level', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    confirmed.validate('secret', compile('/passwordConfirmation').compiledOptions, {
      errorReporter: reporter,
      field: 'password',
      pointer: 'user.password',
      tip: {
        password_confirmation: 'secret',
      },
      root: {
        passwordConfirmation: 'secret',
      },
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

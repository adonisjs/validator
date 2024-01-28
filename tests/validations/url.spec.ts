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
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { url } from '../../src/validations/string/url.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { UrlValidationOptions } from '../../src/types.js'

function compile(options?: UrlValidationOptions) {
  return url.compile('literal', 'string', rules.url(options).options, {})
}

test.group('Url', () => {
  validate(url, test, '9999', 'google.com', compile())

  test('ignore validation when value is not a valid string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'website',
      pointer: 'website',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when value fails the url validation', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate('foo', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'website',
      pointer: 'website',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'website',
          rule: 'url',
          message: 'url validation failed',
        },
      ],
    })
  })

  test('work fine when value passes the url validation', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate('google.com', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'website',
      pointer: 'website',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('report error when url protocol is missing', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate(
      'google.com',
      compile({
        requireProtocol: true,
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'website',
        pointer: 'website',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'website',
          rule: 'url',
          message: 'url validation failed',
        },
      ],
    })
  })

  test("report error when url protocol doesn't match", ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate(
      'http://google.com',
      compile({
        requireProtocol: true,
        protocols: ['https'],
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'website',
        pointer: 'website',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'website',
          rule: 'url',
          message: 'url validation failed',
        },
      ],
    })
  })

  test("report error when url protocol doesn't match and requireProtocol is not explicitly enabled", ({
    assert,
  }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate(
      'google.com',
      compile({
        protocols: ['https'],
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'website',
        pointer: 'website',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'website',
          rule: 'url',
          message: 'url validation failed',
        },
      ],
    })
  })

  test("allow value when url protocol doesn't match and requireProtocol is explicitly disabled", ({
    assert,
  }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate(
      'google.com',
      compile({
        requireProtocol: false,
        protocols: ['https'],
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'website',
        pointer: 'website',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [],
    })
  })

  test('report error when url hostname is not part of allowedHosts', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate(
      'http://google.com',
      compile({
        requireProtocol: true,
        allowedHosts: ['twitter.com'],
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'website',
        pointer: 'website',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'website',
          rule: 'url',
          message: 'url validation failed',
        },
      ],
    })
  })

  test('report error when url hostname is part of bannedHosts', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    url.validate(
      'http://twitter.com',
      compile({
        requireProtocol: true,
        bannedHosts: ['twitter.com'],
      }).compiledOptions,
      {
        errorReporter: reporter,
        field: 'website',
        pointer: 'website',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'website',
          rule: 'url',
          message: 'url validation failed',
        },
      ],
    })
  })
})

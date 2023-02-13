/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { UrlNormalizationOptions } from '../../src/types.js'

import { rules } from '../../src/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { normalizeUrl } from '../../src/validations/string/normalize_url.js'

function compile(options?: UrlNormalizationOptions) {
  return normalizeUrl.compile('literal', 'string', rules.normalizeUrl(options).options, {})
}

test.group('Url | normalizeUrl', () => {
  test('add protocol to the url if missing', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let website = 'google.com'

    normalizeUrl.validate(website, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'website',
      pointer: 'website',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (website = newValue),
    })

    assert.equal(website, 'http://google.com')
  })

  test('add the default protocol to the url', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let website = 'google.com'

    normalizeUrl.validate(website, compile({ defaultProtocol: 'https' }).compiledOptions, {
      errorReporter: reporter,
      field: 'website',
      pointer: 'website',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (website = newValue),
    })

    assert.equal(website, 'https://google.com')
  })

  test('strip www', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let website = 'www.google.com'

    normalizeUrl.validate(website, compile({ stripWWW: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'website',
      pointer: 'website',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (website = newValue),
    })

    assert.equal(website, 'http://google.com')
  })
})

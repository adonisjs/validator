/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { UrlNormalizationOptions } from '@ioc:Adonis/Core/Validator'

import { rules } from '../../src/Rules'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { normalizeUrl } from '../../src/Validations/string/normalizeUrl'

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

    normalizeUrl.validate(website, compile({ defaultProtocol: 'ftp' }).compiledOptions, {
      errorReporter: reporter,
      field: 'website',
      pointer: 'website',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (website = newValue),
    })

    assert.equal(website, 'ftp://google.com')
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

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
import { validate } from '../fixtures/rules/index'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { string } from '../../src/Validations/primitives/string'

function compile (options?: { escape: true }) {
  return string.compile('literal', 'string', rules['string'](options).options)
}

test.group('String', () => {
  validate(string, test, 22, 'anystring', compile())

  test('report error when value is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    string.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'string',
      message: 'string validation failed',
    }])
  })

  test('report error when value is a number', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    string.validate(22, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'string',
      message: 'string validation failed',
    }])
  })

  test('work fine when value is a valid string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    string.validate('22', compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('escape string when enabled', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value = '<p>hello world</p>'

    string.validate(value, compile({ escape: true }).compiledOptions, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: (newValue) => value = newValue,
    })

    assert.equal(value, '&lt;p&gt;hello world&lt;&#x2F;p&gt;')
  })
})

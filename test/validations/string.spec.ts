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
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { string } from '../../src/Validations/primitives/string'

function compile (options?: { escape: true }) {
  return string.compile('literal', 'string', rules['string'](options).options)
}

test.group('String', () => {
  validate(string, test, 22, 'anystring', compile())

  test('report error when value is null', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    string.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'username',
        rule: 'string',
        message: 'string validation failed',
      }],
    })
  })

  test('report error when value is a number', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    string.validate(22, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [{
        field: 'username',
        rule: 'string',
        message: 'string validation failed',
      }],
    })
  })

  test('work fine when value is a valid string', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    string.validate('22', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('escape string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = '<p>hello world</p>'

    string.validate(value, compile({ escape: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => value = newValue,
    })

    assert.equal(value, '&lt;p&gt;hello world&lt;&#x2F;p&gt;')
  })
})

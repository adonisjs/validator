/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { rules } from '../../src/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { escape } from '../../src/validations/string/escape.js'

function compile() {
  return escape.compile('literal', 'string', rules.escape().options, {})
}

test.group('String | escape', () => {
  test('escape string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = '<p>hello world</p>'

    escape.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, '&lt;p&gt;hello world&lt;&#x2F;p&gt;')
  })
})

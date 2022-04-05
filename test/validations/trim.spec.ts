/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { rules } from '../../src/Rules'
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { trim } from '../../src/Validations/string/trim'

function compile() {
  return trim.compile('literal', 'string', rules.trim().options, {})
}

test.group('String | trim', () => {
  test('trim string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = '    hello world'

    trim.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'hello world')
  })
})

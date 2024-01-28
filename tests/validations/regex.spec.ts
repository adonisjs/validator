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
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { regex } from '../../src/validations/string/regex.js'

function compile() {
  // Regex Example for tax id validation from Brazil
  return regex.compile(
    'literal',
    'string',
    rules.regex(/(^\d{3}.\d{3}.\d{3}-\d{2}$|^\d{11}$|^\d{14}$|^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$)/gm)
      .options,
    {}
  )
}

test.group('Regex', () => {
  validate(regex, test, '9999', '99.999.999/0001-99', compile())

  test('compile regex rule with flags', ({ assert }) => {
    const { compiledOptions } = regex.compile('literal', 'string', rules.regex(/[a-z]/g).options)
    assert.deepEqual(compiledOptions, { pattern: '[a-z]', flags: 'g' })
  })

  test('compile regex rule without flags', ({ assert }) => {
    const { compiledOptions } = regex.compile('literal', 'string', rules.regex(/[a-z]/).options)
    assert.deepEqual(compiledOptions, { pattern: '[a-z]', flags: '' })
  })

  test('ignore validation when value is not a valid string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    regex.validate(null, compile().compiledOptions, {
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

  test('report error when value fails the regex pattern', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    regex.validate('999999990001', compile().compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'username',
          rule: 'regex',
          message: 'regex validation failed',
        },
      ],
    })
  })

  test('work fine when value passes the regex pattern', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    regex.validate('99.999.999/0001-99', compile().compiledOptions, {
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
})

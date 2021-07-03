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
import { StringOptions } from '@ioc:Adonis/Core/Validator'

function compile(options?: StringOptions) {
  return string.compile('literal', 'string', rules['string'](options).options, {})
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
      errors: [
        {
          field: 'username',
          rule: 'string',
          message: 'string validation failed',
        },
      ],
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
      errors: [
        {
          field: 'username',
          rule: 'string',
          message: 'string validation failed',
        },
      ],
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

  test('lowerCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'Hello-World'

    string.validate(value, compile({ case: 'lowerCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'hello-world')
  })

  test('upperCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'Hello-World'

    string.validate(value, compile({ case: 'upperCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'HELLO-WORLD')
  })

  test('camelCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'Hello-World'

    string.validate(value, compile({ case: 'camelCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'helloWorld')
  })

  test('snakeCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'Hello-World'

    string.validate(value, compile({ case: 'snakeCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'hello_world')
  })

  test('dashCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'Hello World'

    string.validate(value, compile({ case: 'dashCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'hello-world')
  })

  test('pascalCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'hello world'

    string.validate(value, compile({ case: 'pascalCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'HelloWorld')
  })

  test('capitalCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'hello world'

    string.validate(value, compile({ case: 'capitalCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'Hello World')
  })

  test('sentenceCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'Hello World'

    string.validate(value, compile({ case: 'sentenceCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'Hello world')
  })

  test('noCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'hello.world'

    string.validate(value, compile({ case: 'noCase' }).compiledOptions, {
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

  test('titleCase string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'Here is a fox'

    string.validate(value, compile({ case: 'titleCase' }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'Here Is a Fox')
  })

  test('pluralize string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'post'

    string.validate(value, compile({ pluralize: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'posts')
  })

  test('singularize string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'posts'

    string.validate(value, compile({ singularize: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'post')
  })

  test('trim string when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = ' untrimmed string '

    string.validate(value, compile({ trim: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'untrimmed string')
  })

  test('condense white space when enabled', (assert) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    let value = 'uncondensed  string'

    string.validate(value, compile({ condenseWhitespace: true }).compiledOptions, {
      errorReporter: reporter,
      field: 'username',
      pointer: 'username',
      tip: {},
      root: {},
      refs: {},
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, 'uncondensed string')
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
      mutate: (newValue) => (value = newValue),
    })

    assert.equal(value, '&lt;p&gt;hello world&lt;&#x2F;p&gt;')
  })
})

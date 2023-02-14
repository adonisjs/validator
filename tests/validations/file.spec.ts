/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { FileValidationOptions } from '@adonisjs/bodyparser/types'
import { MultipartFileFactory } from '@adonisjs/bodyparser/factories'

import { rules } from '../../src/rules/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { file } from '../../src/validations/primitives/file.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'

function compile(options: Partial<FileValidationOptions>) {
  return file.compile('literal', 'file', (rules as any)['file'](options).options, {})
}

test.group('File', () => {
  const multipartFile = new MultipartFileFactory().merge({ size: 8, extname: 'jpg' }).create()
  validate(
    file,
    test,
    {},
    multipartFile,
    compile({
      size: 10,
      extnames: ['jpg'],
    })
  )

  test('do not compile when args are not defined', ({ assert }) => {
    const fn = () => file.compile('literal', 'file')
    assert.throws(fn, '"file": The 3rd argument must be a combined array of arguments')
  })

  test('compile with empty object when options are not defined', ({ assert }) => {
    assert.deepEqual(file.compile('literal', 'file', []), {
      async: false,
      allowUndefineds: false,
      name: 'file',
      compiledOptions: {},
    })
  })

  test('report error when value is not a file', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    file.validate({}, compile({}).compiledOptions!, {
      errorReporter: reporter,
      field: 'avatar',
      pointer: 'avatar',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'avatar',
          rule: 'file',
          message: 'file validation failed',
          args: {},
        },
      ],
    })
  })

  test('report error when size validation fails', ({ assert }) => {
    const mp = new MultipartFileFactory()
      .merge({ size: 20, extname: 'jpg', fieldName: 'avatar' })
      .create()

    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    file.validate(mp, compile({ size: 10 }).compiledOptions!, {
      errorReporter: reporter,
      field: 'avatar',
      pointer: 'avatar',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'avatar',
          rule: 'file.size',
          message: 'File size should be less than 10B',
          args: { size: 10 },
        },
      ],
    })
  })

  test('report error when extension validation fails', ({ assert }) => {
    const mp = new MultipartFileFactory()
      .merge({ size: 20, extname: 'png', fieldName: 'avatar' })
      .create()

    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    file.validate(mp, compile({ extnames: ['jpg'] }).compiledOptions!, {
      errorReporter: reporter,
      field: 'avatar',
      pointer: 'avatar',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'avatar',
          rule: 'file.extname',
          message: 'Invalid file extension png. Only jpg is allowed',
          args: { extnames: ['jpg'] },
        },
      ],
    })
  })

  test('work fine when field is a valid file', ({ assert }) => {
    const mp = new MultipartFileFactory()
      .merge({ size: 20, extname: 'png', fieldName: 'avatar' })
      .create()

    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    file.validate(mp, compile({ extnames: ['png'] }).compiledOptions!, {
      errorReporter: reporter,
      field: 'avatar',
      pointer: 'avatar',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

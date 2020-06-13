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
import { MessagesBag } from '../../src/MessagesBag'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'
import { File } from '@adonisjs/bodyparser/build/src/Multipart/File'

import { validate } from '../fixtures/rules/index'
import { file } from '../../src/Validations/primitives/file'

function compile (options: Partial<FileValidationOptions>) {
  return file.compile('literal', 'file', rules['file'](options).options)
}

test.group('File', () => {
  const multipartFile = new File({ fieldName: 'avatar', clientName: 'avatar', headers: {} }, {})
  multipartFile.state = 'consumed'
  multipartFile.size = 8
  multipartFile.extname = 'jpg'

  validate(file, test, {}, multipartFile, compile({
    size: 10,
    extnames: ['jpg'],
  }))

  test('do not compile when args are not defined', (assert) => {
    const fn = () => file.compile('literal', 'file')
    assert.throw(fn, 'file: The 3rd argument must be a combined array of arguments')
  })

  test('compile with empty object when options are not defined', (assert) => {
    assert.deepEqual(file.compile('literal', 'file', []), {
      async: false,
      allowUndefineds: false,
      name: 'file',
      compiledOptions: {},
    })
  })

  test('report error when value is not a file', (assert) => {
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
      errors: [{
        field: 'avatar',
        rule: 'file',
        message: 'file validation failed',
      }],
    })
  })

  test('report error when size validation fails', (assert) => {
    const mp = new File({ fieldName: 'avatar', clientName: 'avatar', headers: {} }, {})
    mp.state = 'consumed'
    mp.size = 20
    mp.extname = 'jpg'

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
      errors: [{
        field: 'avatar',
        rule: 'file.size',
        message: 'File size should be less than 10B',
      }],
    })
  })

  test('report error when extension validation fails', (assert) => {
    const mp = new File({ fieldName: 'avatar', clientName: 'avatar', headers: {} }, {})
    mp.state = 'consumed'
    mp.size = 20
    mp.extname = 'png'

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
      errors: [{
        field: 'avatar',
        rule: 'file.extname',
        message: 'Invalid file extension png. Only jpg is allowed',
      }],
    })
  })

  test('work fine when field is a valid file', (assert) => {
    const mp = new File({ fieldName: 'avatar', clientName: 'avatar', headers: {} }, {})
    mp.state = 'consumed'
    mp.size = 20
    mp.extname = 'png'

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

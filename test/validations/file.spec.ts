/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { File } from '@adonisjs/bodyparser/build/src/Multipart/File'

import { validate } from '../fixtures/rules/index'
import { file } from '../../src/Validations/primitives/file'

test.group('File', () => {
  const multipartFile = new File({ fieldName: 'avatar', clientName: 'avatar', headers: {} }, {})
  multipartFile.state = 'consumed'
  multipartFile.size = 8
  multipartFile.extname = 'jpg'

  validate(file, test, {}, multipartFile, {
    options: {
      size: 10,
      extnames: ['jpg'],
    },
  })

  test('report error when value is not a file', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    file.validate({}, {}, {
      errorReporter: reporter,
      pointer: 'avatar',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'avatar',
      rule: 'file',
      message: 'file validation failed',
    }])
  })

  test('report error when size validation fails', (assert) => {
    const mp = new File({ fieldName: 'avatar', clientName: 'avatar', headers: {} }, {})
    mp.state = 'consumed'
    mp.size = 20
    mp.extname = 'jpg'

    const reporter = new ApiErrorReporter({}, false)
    file.validate(mp, { size: 10 }, {
      errorReporter: reporter,
      pointer: 'avatar',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'avatar',
      rule: 'file.size',
      message: 'File size should be less than 10B',
    }])
  })

  test('report error when extension validation fails', (assert) => {
    const mp = new File({ fieldName: 'avatar', clientName: 'avatar', headers: {} }, {})
    mp.state = 'consumed'
    mp.size = 20
    mp.extname = 'png'

    const reporter = new ApiErrorReporter({}, false)
    file.validate(mp, { extnames: ['jpg'] }, {
      errorReporter: reporter,
      pointer: 'avatar',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'avatar',
      rule: 'file.extname',
      message: 'Invalid file extension png. Only jpg is allowed',
    }])
  })
})

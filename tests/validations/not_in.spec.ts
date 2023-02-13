/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import { NodeSubType } from '../../src/types.js'

import { rules } from '../../src/rules/index.js'
import { schema } from '../../src/schema/index.js'
import { validate } from '../fixtures/rules/index.js'
import { MessagesBag } from '../../src/messages_bag/index.js'
import { ApiErrorReporter } from '../../src/error_reporter/index.js'
import { notIn } from '../../src/validations/miscellaneous/not_in.js'

function compile(values: any, subtype?: NodeSubType) {
  return notIn.compile('literal', subtype || 'string', rules.notIn(values).options, {})
}

test.group('notIn', () => {
  validate(notIn, test, '1', '10', compile(['1', '2']))

  test('do not compile when values are not defined', ({ assert }) => {
    const fn = () => notIn.compile('literal', 'string')
    assert.throws(fn, '"notIn": The 3rd argument must be a combined array of arguments')
  })

  test('do not compile when notIn is not an array of values', ({ assert }) => {
    const fn = () => notIn.compile('literal', 'string', ['foo'])
    assert.throws(fn, '"notIn": expects an array of "notIn values" or a "ref"')
  })
})

test.group('notIn | string', () => {
  test('report error when value is part of notIn values', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    notIn.validate('3', compile(['3', '4']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'points',
          rule: 'notIn',
          args: { values: ['3', '4'] },
          message: 'notIn validation failed',
        },
      ],
    })
  })

  test('work fine when value is not part of notIn', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    notIn.validate('1', compile(['3', '4']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('skip when value is not a string', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    notIn.validate(null, compile(['3', '4']).compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

test.group('notIn | number', () => {
  test('report error when value is part of notIn values', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    notIn.validate(3, compile([3, 4], 'number').compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'points',
          rule: 'notIn',
          args: { values: [3, 4] },
          message: 'notIn validation failed',
        },
      ],
    })
  })

  test('work fine when value is not part of notIn', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    notIn.validate(1, compile([3, 4], 'number').compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('skip when value is not a number', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    notIn.validate('foo', compile([3, 4], 'number').compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

test.group('notIn | date', () => {
  test('report error when value is part of notIn values', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publicHolidays = ['2020-12-25', '2021-01-01']

    notIn.validate(
      DateTime.fromISO('2020-12-25'),
      compile(publicHolidays, 'date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'points',
        pointer: 'points',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'points',
          rule: 'notIn',
          args: { values: ['2020-12-25', '2021-01-01'] },
          message: 'notIn validation failed',
        },
      ],
    })
  })

  test('work fine when value is not part of notIn', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publicHolidays = ['2020-12-25', '2021-01-01']

    notIn.validate(
      DateTime.fromISO('2020-12-24'),
      compile(publicHolidays, 'date').compiledOptions!,
      {
        errorReporter: reporter,
        field: 'points',
        pointer: 'points',
        tip: {},
        root: {},
        refs: {},
        mutate: () => {},
      }
    )

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('skip when value is not a date', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)
    const publicHolidays = ['2020-12-25', '2021-01-01']

    notIn.validate('2020-12-25', compile(publicHolidays, 'date').compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

test.group('notIn | array', () => {
  test('report error when value is part of notIn values', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    notIn.validate(['1', '2', '3'], compile(['10', '3', '6'], 'array').compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'points',
          rule: 'notIn',
          args: { values: ['10', '3', '6'] },
          message: 'notIn validation failed',
        },
      ],
    })
  })

  test('work fine when value is not part of notIn values', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    notIn.validate(['1', '2', '4'], compile(['10', '3', '6'], 'array').compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })

  test('skip when value is not an array', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    notIn.validate('3', compile(['10', '3', '6'], 'array').compiledOptions!, {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

test.group('notIn | refs', () => {
  test('report error when value is part of notIn values', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    const validator = {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: schema.refs({
        notInvalues: ['3', '4'],
      }),
      mutate: () => {},
    }

    notIn.validate('3', compile(validator.refs.notInvalues).compiledOptions!, validator)

    assert.deepEqual(reporter.toJSON(), {
      errors: [
        {
          field: 'points',
          rule: 'notIn',
          args: { values: ['3', '4'] },
          message: 'notIn validation failed',
        },
      ],
    })
  })

  test('work fine when value is not a part of notIn values', ({ assert }) => {
    const reporter = new ApiErrorReporter(new MessagesBag({}), false)

    const validator = {
      errorReporter: reporter,
      field: 'points',
      pointer: 'points',
      tip: {},
      root: {},
      refs: schema.refs({
        notInvalues: ['3', '4'],
      }),
      mutate: () => {},
    }

    notIn.validate('1', compile(validator.refs.notInvalues).compiledOptions!, validator)
    assert.deepEqual(reporter.toJSON(), { errors: [] })
  })
})

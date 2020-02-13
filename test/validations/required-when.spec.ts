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
import { requiredWhen } from '../../src/Validations/existence/requiredWhen'

test.group('Required When (compile)', () => {
  test('do not compile when field is not defined', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', {
    })

    assert.throw(fn, 'requiredWhen: expects a "field", "operator" and "comparisonValue"')
  })

  test('do not compile when operator is not defined', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
    })

    assert.throw(fn, 'requiredWhen: expects a "field", "operator" and "comparisonValue"')
  })

  test('do not compile when comparisonValue is not defined', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: '=',
    })

    assert.throw(fn, 'requiredWhen: expects a "field", "operator" and "comparisonValue"')
  })

  test('do not compile when operator is not one of the whitelisted ones', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: 'foo',
      comparisonValues: 'bar',
    })

    assert.throw(fn, 'requiredWhen: expects "operator" to be one of the whitelisted operators')
  })

  test('do not compile when operator is not one of the whitelisted ones', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: 'foo',
      comparisonValues: 'bar',
    })

    assert.throw(fn, 'requiredWhen: expects "operator" to be one of the whitelisted operators')
  })

  test('do not compile when comparisonValues is not an array when using in operator', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: 'in',
      comparisonValues: 'bar',
    })

    assert.throw(fn, 'requiredWhen: "in" operator expects an array of "comparisonValues"')
  })

  test('do not compile when comparisonValues is not an array when using notIn operator', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: 'notIn',
      comparisonValues: 'bar',
    })

    assert.throw(fn, 'requiredWhen: "notIn" operator expects an array of "comparisonValues"')
  })

  test('do not compile when comparisonValues is not a number and using arithmetic operator', (assert) => {
    const gt = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: '>',
      comparisonValues: 'bar',
    })

    const lt = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: '<',
      comparisonValues: 'bar',
    })

    const gteq = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: '>=',
      comparisonValues: 'bar',
    })

    const lteq = () => requiredWhen.compile('literal', 'string', {
      field: 'value',
      operator: '<=',
      comparisonValues: 'bar',
    })

    assert.throw(gt, 'requiredWhen: ">" operator expects "comparisonValue" to be an integer')
    assert.throw(lt, 'requiredWhen: "<" operator expects "comparisonValue" to be an integer')
    assert.throw(gteq, 'requiredWhen: ">=" operator expects "comparisonValue" to be an integer')
    assert.throw(lteq, 'requiredWhen: "<=" operator expects "comparisonValue" to be an integer')
  })
})

test.group('Required When [=]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'type',
      operator: '=',
      comparisonValues: 'twitter',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'twitter_handle',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'type',
      operator: '=',
      comparisonValues: 'twitter',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'twitter_handle',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'type',
      operator: '=',
      comparisonValues: 'twitter',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'twitter_handle',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('@AmanVirk1', {
      field: 'type',
      operator: '=',
      comparisonValues: 'twitter',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'type',
      operator: '=',
      comparisonValues: 'twitter',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'facebook',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'type',
      operator: '=',
      comparisonValues: 'twitter',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

test.group('Required When [!=]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'type',
      operator: '!=',
      comparisonValues: 'facebook',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'twitter_handle',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'type',
      operator: '!=',
      comparisonValues: 'facebook',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'twitter_handle',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'type',
      operator: '!=',
      comparisonValues: 'facebook',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'twitter_handle',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'type',
      operator: '!=',
      comparisonValues: 'facebook',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'twitter_handle',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('@AmanVirk1', {
      field: 'type',
      operator: '!=',
      comparisonValues: 'facebook',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'type',
      operator: '!=',
      comparisonValues: 'facebook',
    }, {
      errorReporter: reporter,
      pointer: 'twitter_handle',
      tip: {
        type: 'facebook',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

test.group('Required When [in]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'calculation_type',
      operator: 'in',
      comparisonValues: ['FIXED', 'PERCENTAGE'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'value',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'calculation_type',
      operator: 'in',
      comparisonValues: ['FIXED', 'PERCENTAGE'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'value',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'calculation_type',
      operator: 'in',
      comparisonValues: ['FIXED', 'PERCENTAGE'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'value',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('@AmanVirk1', {
      field: 'calculation_type',
      operator: 'in',
      comparisonValues: ['FIXED', 'PERCENTAGE'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'calculation_type',
      operator: 'in',
      comparisonValues: ['FIXED', 'PERCENTAGE'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'VARIABLE',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'calculation_type',
      operator: 'in',
      comparisonValues: ['FIXED', 'PERCENTAGE'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

test.group('Required When [notIn]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'calculation_type',
      operator: 'notIn',
      comparisonValues: ['VARIABLE', 'FORMULA'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'value',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'calculation_type',
      operator: 'notIn',
      comparisonValues: ['VARIABLE', 'FORMULA'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'value',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'calculation_type',
      operator: 'notIn',
      comparisonValues: ['VARIABLE', 'FORMULA'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'value',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'calculation_type',
      operator: 'notIn',
      comparisonValues: ['VARIABLE', 'FORMULA'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'value',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('@AmanVirk1', {
      field: 'calculation_type',
      operator: 'notIn',
      comparisonValues: ['VARIABLE', 'FORMULA'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'FIXED',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'calculation_type',
      operator: 'notIn',
      comparisonValues: ['VARIABLE', 'FORMULA'],
    }, {
      errorReporter: reporter,
      pointer: 'value',
      tip: {
        calculation_type: 'VARIABLE',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

test.group('Required When [>]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '>',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'age',
      operator: '>',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'age',
      operator: '>',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('131002020', {
      field: 'age',
      operator: '>',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '>',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 17,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('192010202', {
      field: 'age',
      operator: '>',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

test.group('Required When [<]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '<',
      comparisonValues: 40,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'age',
      operator: '<',
      comparisonValues: 40,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'age',
      operator: '<',
      comparisonValues: 40,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('131002020', {
      field: 'age',
      operator: '<',
      comparisonValues: 40,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 20,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '<',
      comparisonValues: 40,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 41,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('192010202', {
      field: 'age',
      operator: '<',
      comparisonValues: 40,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

test.group('Required When [>=]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '>=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'age',
      operator: '>=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'age',
      operator: '>=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('131002020', {
      field: 'age',
      operator: '>=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '>=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 17,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('192010202', {
      field: 'age',
      operator: '>=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

test.group('Required When [<=]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '<=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(undefined, {
      field: 'age',
      operator: '<=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('', {
      field: 'age',
      operator: '<=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'drivers_license',
      rule: 'requiredWhen',
      message: 'requiredWhen validation failed',
    }])
  })

  test('work fine when expectation matches and field is present', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('131002020', {
      field: 'age',
      operator: '<=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 18,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation fails and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, {
      field: 'age',
      operator: '<=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
        age: 19,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when target field value is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate('192010202', {
      field: 'age',
      operator: '<=',
      comparisonValues: 18,
    }, {
      errorReporter: reporter,
      pointer: 'drivers_license',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

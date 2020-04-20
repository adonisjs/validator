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
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { requiredWhen } from '../../src/Validations/existence/requiredWhen'

function compile (
  field: string,
  operator: 'in' | 'notIn' | '=' | '!=' | '>' | '<' | '>=' | '<=',
  comparisonValue: any,
) {
  return requiredWhen.compile(
    'literal',
    'string',
    rules.requiredWhen(field, operator, comparisonValue).options,
  )
}

test.group('Required When (compile)', () => {
  validate(requiredWhen, test, undefined, 'foo', compile('type', '=', 'twitter'), {
    tip: {
      type: 'twitter',
    },
  })

  test('do not compile when args are not defined', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string')
    assert.throw(fn, 'requiredWhen: The 3rd arguments must be a combined array of arguments')
  })

  test('do not compile when field is not defined', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', [])
    assert.throw(fn, 'requiredWhen: expects a "field", "operator" and "comparisonValue"')
  })

  test('do not compile when operator is not defined', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', ['value'])
    assert.throw(fn, 'requiredWhen: expects a "field", "operator" and "comparisonValue"')
  })

  test('do not compile when comparisonValue is not defined', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', ['value', '='])

    assert.throw(fn, 'requiredWhen: expects a "field", "operator" and "comparisonValue"')
  })

  test('do not compile when operator is not one of the whitelisted ones', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', ['value', 'foo', 'bar'])
    assert.throw(fn, 'requiredWhen: expects "operator" to be one of the whitelisted operators')
  })

  test('do not compile when comparisonValues is not an array when using in operator', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', ['value', 'in', 'bar'])
    assert.throw(fn, 'requiredWhen: "in" operator expects an array of "comparisonValues"')
  })

  test('do not compile when comparisonValues is not an array when using notIn operator', (assert) => {
    const fn = () => requiredWhen.compile('literal', 'string', ['value', 'notIn', 'bar'])
    assert.throw(fn, 'requiredWhen: "notIn" operator expects an array of "comparisonValues"')
  })

  test('do not compile when comparisonValues is not a number and using arithmetic operator', (assert) => {
    const gt = () => requiredWhen.compile('literal', 'string', ['value', '>', 'bar'])
    const lt = () => requiredWhen.compile('literal', 'string', ['value', '<', 'bar'])
    const gteq = () => requiredWhen.compile('literal', 'string', ['value', '>=', 'bar'])
    const lteq = () => requiredWhen.compile('literal', 'string', ['value', '<=', 'bar'])

    assert.throw(gt, 'requiredWhen: ">" operator expects "comparisonValue" to be a number')
    assert.throw(lt, 'requiredWhen: "<" operator expects "comparisonValue" to be a number')
    assert.throw(gteq, 'requiredWhen: ">=" operator expects "comparisonValue" to be a number')
    assert.throw(lteq, 'requiredWhen: "<=" operator expects "comparisonValue" to be a number')
  })
})

test.group('Required When [=]', () => {
  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredWhen.validate(null, compile('type', '=', 'twitter').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(undefined, compile('type', '=', 'twitter').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate('', compile('type', '=', 'twitter').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate('@AmanVirk1', compile('type', '=', 'twitter').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(null, compile('type', '=', 'twitter').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(null, compile('type', '=', 'twitter').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(null, compile('type', '!=', 'facebook').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(undefined, compile('type', '!=', 'facebook').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate('', compile('type', '!=', 'facebook').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(null, compile('type', '!=', 'facebook').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate('@AmanVirk1', compile('type', '!=', 'facebook').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(null, compile('type', '!=', 'facebook').compiledOptions!, {
      errorReporter: reporter,
      field: 'twitter_handle',
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
    requiredWhen.validate(null, compile('calculation_type', 'in', ['FIXED', 'PERCENTAGE']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate(undefined, compile('calculation_type', 'in', ['FIXED', 'PERCENTAGE']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate('', compile('calculation_type', 'in', ['FIXED', 'PERCENTAGE']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate('@AmanVirk1', compile('calculation_type', 'in', ['FIXED', 'PERCENTAGE']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate(null, compile('calculation_type', 'in', ['FIXED', 'PERCENTAGE']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate(null, compile('calculation_type', 'in', ['FIXED', 'PERCENTAGE']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate(null, compile('calculation_type', 'notIn', ['VARIABLE', 'FORMULA']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate(undefined, compile('calculation_type', 'notIn', ['VARIABLE', 'FORMULA']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate('', compile('calculation_type', 'notIn', ['VARIABLE', 'FORMULA']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate('', compile('calculation_type', 'notIn', ['VARIABLE', 'FORMULA']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    const { compiledOptions } = compile('calculation_type', 'notIn', ['VARIABLE', 'FORMULA'])

    requiredWhen.validate('@AmanVirk1', compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate(null, compile('calculation_type', 'notIn', ['VARIABLE', 'FORMULA']).compiledOptions!, {
      errorReporter: reporter,
      field: 'value',
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
    requiredWhen.validate(null, compile('age', '>', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(undefined, compile('age', '>', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('', compile('age', '>', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('131002020', compile('age', '>', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(null, compile('age', '>', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('192010202', compile('age', '>', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(null, compile('age', '<', 40).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(undefined, compile('age', '<', 40).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('', compile('age', '<', 40).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('131002020', compile('age', '<', 40).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(null, compile('age', '<', 40).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('192010202', compile('age', '<', 40).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(null, compile('age', '>=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(undefined, compile('age', '>=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('', compile('age', '>=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('131002020', compile('age', '>=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(null, compile('age', '>=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('192010202', compile('age', '>=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(null, compile('age', '<=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(undefined, compile('age', '<=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('', compile('age', '<=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('131002020', compile('age', '<=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate(null, compile('age', '<=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
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
    requiredWhen.validate('192010202', compile('age', '<=', 18).compiledOptions!, {
      errorReporter: reporter,
      field: 'drivers_license',
      pointer: 'drivers_license',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})

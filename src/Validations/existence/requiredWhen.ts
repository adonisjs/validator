/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { getFieldValue } from '../../utils'

const DEFAULT_MESSAGE = 'requiredWhen validation failed'

/**
 * Available operators
 */
const OPERATORS = {
  'in': {
    compile (comparisonValues) {
      if (!Array.isArray(comparisonValues)) {
        throw new Error('requiredWhen: "in" operator expects an array of "comparisonValues"')
      }
    },

    validate: (value: any, comparisonValues: any[]) => {
      return comparisonValues.includes(value)
    },
  },

  'notIn': {
    compile (comparisonValues) {
      if (!Array.isArray(comparisonValues)) {
        throw new Error('requiredWhen: "notIn" operator expects an array of "comparisonValues"')
      }
    },

    validate: (value: any, comparisonValues: any[]) => {
      return !comparisonValues.includes(value)
    },
  },

  '=': {
    validate: (value: any, comparisonValue: any) => {
      return value === comparisonValue
    },
  },

  '!=': {
    validate: (value: any, comparisonValue: any) => {
      return value !== comparisonValue
    },
  },

  '>': {
    compile (comparisonValue) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error('requiredWhen: ">" operator expects "comparisonValue" to be an integer')
      }
    },

    validate: (value: number, comparisonValue: number) => {
      return value > comparisonValue
    },
  },

  '<': {
    compile (comparisonValue) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error('requiredWhen: "<" operator expects "comparisonValue" to be an integer')
      }
    },

    validate: (value: number, comparisonValue: number) => {
      return value < comparisonValue
    },
  },

  '>=': {
    compile (comparisonValue) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error('requiredWhen: ">=" operator expects "comparisonValue" to be an integer')
      }
    },

    validate: (value: number, comparisonValue: number) => {
      return value >= comparisonValue
    },
  },

  '<=': {
    compile (comparisonValue) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error('requiredWhen: "<=" operator expects "comparisonValue" to be an integer')
      }
    },

    validate: (value: number, comparisonValue: number) => {
      return value <= comparisonValue
    },
  },
}

/**
 * Ensure the value exists when defined expectation passed.
 * `null`, `undefined` and `empty string` fails the validation.
 */
export const requiredWhen: SyncValidation<{
  operator: keyof typeof OPERATORS,
  field: string,
  comparisonValues: any | any[],
}> = {
  compile (_, __, options) {
    /**
     * Ensure "field", "operator" and "comparisonValues" are defined
     */
    if (!options || !options.field || !options.operator || !options.comparisonValues) {
      throw new Error('requiredWhen: expects a "field", "operator" and "comparisonValue"')
    }

    /**
     * Ensure "operator" is defined
     */
    if (!OPERATORS[options.operator]) {
      throw new Error('requiredWhen: expects "operator" to be one of the whitelisted operators')
    }

    /**
     * Compile the options for a given operator when they
     * implement a compile function
     */
    if (typeof (OPERATORS[options.operator].compile) === 'function') {
      OPERATORS[options.operator].compile(options.comparisonValue)
    }

    return {
      allowUndefineds: true,
      async: false,
      name: 'requiredWhen',
      compiledOptions: {
        operator: options.operator,
        field: options.field,
        comparisonValues: options.comparisonValues,
      },
    }
  },
  validate (
    value,
    compiledOptions,
    { errorReporter, pointer, arrayExpressionPointer, root, tip },
  ) {
    const otherFieldValue = getFieldValue(compiledOptions.field, root, tip)
    const shouldBeRequired = OPERATORS[compiledOptions.operator].validate(
      otherFieldValue,
      compiledOptions.comparisonValues,
    )

    if (shouldBeRequired && !value && value !== false && value !== 0) {
      errorReporter.report(pointer, 'requiredWhen', DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

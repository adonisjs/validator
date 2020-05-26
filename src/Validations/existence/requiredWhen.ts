/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { exists, getFieldValue, ensureValidArgs } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'requiredWhen validation failed'
const RULE_NAME = 'requiredWhen'

/**
 * Available operators
 */
const OPERATORS = {
  'in': {
    compile (comparisonValues) {
      if (!Array.isArray(comparisonValues)) {
        throw new Error(`${RULE_NAME}: "in" operator expects an array of "comparisonValues"`)
      }
    },

    validate: (value: any, comparisonValues: any[]) => {
      return comparisonValues.includes(value)
    },
  },

  'notIn': {
    compile (comparisonValues: any[]) {
      if (!Array.isArray(comparisonValues)) {
        throw new Error(`${RULE_NAME}: "notIn" operator expects an array of "comparisonValues"`)
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
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: ">" operator expects "comparisonValue" to be a number`)
      }
    },

    validate: (value: number, comparisonValue: number) => {
      return value > comparisonValue
    },
  },

  '<': {
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: "<" operator expects "comparisonValue" to be a number`)
      }
    },

    validate: (value: number, comparisonValue: number) => {
      return value < comparisonValue
    },
  },

  '>=': {
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: ">=" operator expects "comparisonValue" to be a number`)
      }
    },

    validate: (value: number, comparisonValue: number) => {
      return value >= comparisonValue
    },
  },

  '<=': {
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: "<=" operator expects "comparisonValue" to be a number`)
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
  compile (_, __, args) {
    ensureValidArgs(RULE_NAME, args)
    const [field, operator, comparisonValues] = args

    /**
     * Ensure "field", "operator" and "comparisonValues" are defined
     */
    if (!field || !operator || comparisonValues === undefined) {
      throw new Error(`${RULE_NAME}: expects a "field", "operator" and "comparisonValue"`)
    }

    /**
     * Ensure "operator" is defined
     */
    if (!OPERATORS[operator]) {
      throw new Error(`${RULE_NAME}: expects "operator" to be one of the whitelisted operators`)
    }

    /**
     * Compile the options for a given operator when they
     * implement a compile function
     */
    if (typeof (OPERATORS[operator].compile) === 'function') {
      OPERATORS[operator].compile(comparisonValues)
    }

    return {
      allowUndefineds: true,
      async: false,
      name: RULE_NAME,
      compiledOptions: {
        operator,
        field,
        comparisonValues,
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

    if (shouldBeRequired && !exists(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

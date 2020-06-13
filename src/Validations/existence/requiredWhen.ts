/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { exists, getFieldValue, wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'requiredWhen'
const DEFAULT_MESSAGE = 'requiredWhen validation failed'

/**
 * Available operators
 */
const OPERATORS = {
  'in': {
    compile (comparisonValues: any) {
      if (!Array.isArray(comparisonValues)) {
        throw new Error(`${RULE_NAME}: "in" operator expects an array of "comparisonValues"`)
      }
    },

    passes: (value: any, comparisonValues: any[]) => {
      return comparisonValues.includes(value)
    },
  },

  'notIn': {
    compile (comparisonValues: any[]) {
      if (!Array.isArray(comparisonValues)) {
        throw new Error(`${RULE_NAME}: "notIn" operator expects an array of "comparisonValues"`)
      }
    },

    passes: (value: any, comparisonValues: any[]) => {
      return !comparisonValues.includes(value)
    },
  },

  '=': {
    passes: (value: any, comparisonValue: any) => {
      return value === comparisonValue
    },
  },

  '!=': {
    passes: (value: any, comparisonValue: any) => {
      return value !== comparisonValue
    },
  },

  '>': {
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: ">" operator expects "comparisonValue" to be a number`)
      }
    },

    passes: (value: number, comparisonValue: number) => {
      return value > comparisonValue
    },
  },

  '<': {
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: "<" operator expects "comparisonValue" to be a number`)
      }
    },

    passes: (value: number, comparisonValue: number) => {
      return value < comparisonValue
    },
  },

  '>=': {
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: ">=" operator expects "comparisonValue" to be a number`)
      }
    },

    passes: (value: number, comparisonValue: number) => {
      return value >= comparisonValue
    },
  },

  '<=': {
    compile (comparisonValue: number) {
      if (typeof (comparisonValue) !== 'number') {
        throw new Error(`${RULE_NAME}: "<=" operator expects "comparisonValue" to be a number`)
      }
    },

    passes: (value: number, comparisonValue: number) => {
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
  compile: wrapCompile(RULE_NAME, [], ([ field, operator, comparisonValues ]) => {
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
      compiledOptions: {
        operator,
        field,
        comparisonValues,
      },
    }
  }),
  validate (
    value,
    { operator, field, comparisonValues },
    { errorReporter, pointer, arrayExpressionPointer, root, tip },
  ) {
    const shouldBeRequired = OPERATORS[operator].passes(
      getFieldValue(field, root, tip),
      comparisonValues,
    )

    if (shouldBeRequired && !exists(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}

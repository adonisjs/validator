/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import { SyncValidation } from '../../types.js'
import { wrapCompile, enforceArray, isRef } from '../../validator/helpers.js'

const RULE_NAME = 'notIn'
const DEFAULT_MESSAGE = 'notIn validation failed'

const VERIFIERS = {
  string(value: any, values: (string | number)[]) {
    if (typeof value !== 'string') {
      return true
    }
    return !values.includes(value)
  },
  number(value: any, values: (string | number)[]) {
    if (typeof value !== 'number') {
      return true
    }
    return !values.includes(value)
  },
  array(value: any, values: (string | number)[]) {
    if (!Array.isArray(value)) {
      return true
    }
    return !value.find((one) => values.includes(one))
  },
  date(value: DateTime, values: (string | number)[]) {
    if (DateTime.isDateTime(value) === false) {
      return true
    }

    const isoDate = value.toISODate()
    if (!isoDate) {
      return true
    }

    return !values.includes(isoDate)
  },
}

/**
 * Return type of the compile function
 */
type CompileReturnType = {
  values?: (string | number)[]
  ref?: string
  subtype: 'string' | 'number' | 'array' | 'date'
}

/**
 * Ensure the value is one of the defined choices
 */
export const notIn: SyncValidation<CompileReturnType> = {
  compile: wrapCompile<CompileReturnType, CompileReturnType['subtype']>(
    RULE_NAME,
    ['string', 'number', 'array', 'date'],
    ([values], _, subtype) => {
      /**
       * Choices are defined as a ref
       */
      if (isRef(values)) {
        return {
          compiledOptions: { ref: values.key, subtype },
        }
      }

      /**
       * Ensure value is an array or a ref
       */
      if (!values || !Array.isArray(values)) {
        throw new Error(`"${RULE_NAME}": expects an array of "notIn values" or a "ref"`)
      }

      return { compiledOptions: { values, subtype } }
    }
  ),
  validate(value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer, refs }) {
    let values: (string | number)[] = []

    /**
     * Resolve values from the ref or use as it is, if defined as an array
     */
    if (compiledOptions.ref) {
      const runtimevalues = refs[compiledOptions.ref].value
      enforceArray(
        runtimevalues,
        `"${RULE_NAME}": expects "refs.${compiledOptions.ref}" to be an array`
      )
      values = runtimevalues
    } else if (compiledOptions.values) {
      values = compiledOptions.values
    }

    /**
     * Validation
     */
    if (!VERIFIERS[compiledOptions.subtype](value, values)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
        values,
      })
    }
  },
}

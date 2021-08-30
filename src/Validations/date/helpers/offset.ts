/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import { ValidationRuntimeOptions, DurationUnits } from '@ioc:Adonis/Core/Validator'
import { isRef, enforceDateTime } from '../../../Validator/helpers'

/**
 * Return type of the compile function
 */
export type CompileReturnType = {
  operator: '>' | '<'
  offset?: { duration: number; unit: DurationUnits; hasDayDuration: boolean }
  ref?: string
}

/**
 * Returns a luxon date time instance based upon the unit, duration and operator
 */
function getDateTime(
  operator: '>' | '<',
  { unit, duration }: Exclude<CompileReturnType['offset'], undefined>
) {
  if (operator === '>') {
    return DateTime.local().plus({ [unit]: duration })
  }
  return DateTime.local().minus({ [unit]: duration })
}

/**
 * Returns a luxon date time instance based upon the unit, duration and operator
 */
function compareDateTime(
  lhs: DateTime,
  rhs: DateTime,
  operator: '>' | '<',
  options: CompileReturnType['offset']
) {
  if (options && options.hasDayDuration) {
    return operator === '>'
      ? lhs.startOf('day') > rhs.startOf('day')
      : lhs.startOf('day') < rhs.startOf('day')
  }
  return operator === '>' ? lhs > rhs : lhs < rhs
}

/**
 * Compiles an offset based date rule
 */
export function compile(
  ruleName: string,
  operator: '>' | '<',
  [duration, unit]: any[]
): { compiledOptions: CompileReturnType } {
  /**
   * Choices are defined as a ref
   */
  if (isRef(duration)) {
    return {
      compiledOptions: { ref: duration.key, operator },
    }
  }

  /**
   * Converting "today" keyword to offset
   */
  if (duration === 'today') {
    return {
      compiledOptions: {
        operator,
        offset: {
          duration: 0,
          unit: 'days',
          hasDayDuration: true,
        },
      },
    }
  }

  /**
   * Converting "tomorrow", "yesterday" keywords to offset
   */
  if (['tomorrow', 'yesterday'].includes(duration)) {
    return {
      compiledOptions: {
        operator,
        offset: {
          duration: 1,
          unit: 'days',
          hasDayDuration: true,
        },
      },
    }
  }

  /**
   * Ensure value is an array or a ref
   */
  if (!duration || !unit) {
    throw new Error(`"${ruleName}": expects a date offset "duration" and "unit" or a "ref"`)
  }

  /**
   * Ensure interval is a valid number
   */
  if (typeof duration !== 'number') {
    throw new Error(`"${ruleName}": expects "duration" to be a number`)
  }

  return {
    compiledOptions: {
      operator,
      offset: { duration, unit, hasDayDuration: ['day', 'days'].includes(unit) },
    },
  }
}

/**
 * Validates offset based date rules
 */
export function validate(
  ruleName: string,
  errorMessage: string,
  value: any,
  compiledOptions: CompileReturnType,
  { errorReporter, pointer, arrayExpressionPointer, refs }: ValidationRuntimeOptions
) {
  let comparisonDate: DateTime | unknown

  /**
   * Do not run validation when original value is not a dateTime instance.
   */
  if (DateTime.isDateTime(value) === false) {
    return
  }

  /**
   * Resolve datetime to compare against
   */
  if (compiledOptions.ref) {
    comparisonDate = refs[compiledOptions.ref].value
  } else if (compiledOptions.offset) {
    comparisonDate = getDateTime(compiledOptions.operator, compiledOptions.offset)
  }

  enforceDateTime(
    comparisonDate,
    `"${ruleName}": expects "refs.${compiledOptions.ref}" to be an instance of luxon DateTime object`
  )

  if (!compareDateTime(value, comparisonDate, compiledOptions.operator, compiledOptions.offset)) {
    errorReporter.report(pointer, ruleName, errorMessage, arrayExpressionPointer, {
      [ruleName]: comparisonDate.toISO(),
    })
  }
}

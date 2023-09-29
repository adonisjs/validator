/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime, DateTimeOptions } from 'luxon'
import { ValidationRuntimeOptions } from '@ioc:Adonis/Core/Validator'

import { toLuxon } from './toLuxon'
import { getFieldValue } from '../../../Validator/helpers'

/**
 * Return type of the compile function
 */
export type CompileReturnType = {
  operator: '>' | '<' | '>=' | '<='
  field: string
  format?: string
  opts?: DateTimeOptions
}

/**
 * Returns a luxon date time instance based upon the unit, duration and operator
 */
function compareDateTime(
  lhs: DateTime,
  rhs: DateTime,
  operator: CompileReturnType['operator']
): boolean {
  switch (operator) {
    case '>':
      return lhs > rhs
    case '<':
      return lhs < rhs
    case '>=':
      return lhs >= rhs
    case '<=':
      return lhs <= rhs
  }
}

/**
 * Compiles a date field comparison rule
 */
export function compile(
  ruleName: string,
  operator: '>' | '<' | '>=' | '<=',
  [field]: any[],
  rulesTree: any
): { compiledOptions: CompileReturnType } {
  if (!field) {
    throw new Error(`${ruleName}: expects a comparison "field"`)
  }

  return {
    compiledOptions: {
      operator,
      field,
      format: rulesTree.date?.format,
      opts: rulesTree.date?.opts,
    },
  }
}

/**
 * Validates date field comparison rule
 */
export function validate(
  ruleName: string,
  errorMessage: string,
  value: any,
  { field, operator, format, opts }: CompileReturnType,
  { root, tip, errorReporter, pointer, arrayExpressionPointer }: ValidationRuntimeOptions
) {
  /**
   * Skip when value is not a date time instance. One must use date schema
   * type
   */
  if (DateTime.isDateTime(value) === false) {
    return
  }

  const comparisonValue = toLuxon(getFieldValue(field, root, tip), format, opts)

  /**
   * Raise error when comparison field is not a valid date
   */
  if (!comparisonValue || !comparisonValue.isValid) {
    errorReporter.report(pointer, ruleName, errorMessage, arrayExpressionPointer, {
      otherField: field,
      otherFieldValue: comparisonValue,
    })
    return
  }

  if (!compareDateTime(value, comparisonValue, operator)) {
    errorReporter.report(pointer, ruleName, errorMessage, arrayExpressionPointer, {
      otherField: field,
      otherFieldValue: comparisonValue,
    })
  }
}

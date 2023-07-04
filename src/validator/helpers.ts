/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime } from 'luxon'
import lodash from '@poppinss/utils/lodash'

import type {
  NodeType,
  SchemaRef,
  ParsedRule,
  NodeSubType,
  ErrorReporterConstructorContract,
} from '../types.js'

import { Request } from '@adonisjs/core/http'
import * as ErrorReporters from '../error_reporter/index.js'

/**
 * Ensure value is not `undefined`
 */
export function existsStrict(value: any) {
  return value !== undefined && value !== null
}

/**
 * Ensure that value exists. Empty string, null and undefined
 * fails the exists check.
 */
export function exists(value: any) {
  return !!value || value === false || value === 0
}

/**
 * Ensure value is a valid Object. Returns false for `Array` and `null`
 */
export function isObject(value: any) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Enforces the value to be an array
 */
export function enforceArray(value: unknown, message?: string): asserts value is any[] {
  if (!Array.isArray(value)) {
    throw new Error(message || 'Expected value to be an array')
  }
}

/**
 * Enforces the value to be an instance of luxon DateTime object
 */
export function enforceDateTime(value: any, message?: string): asserts value is DateTime {
  if (DateTime.isDateTime(value) === false) {
    throw new Error(message || 'Expected value to be an instance of luxon DateTime object')
  }
}

/**
 * Returns a boolean telling value is a schema ref
 */
export function isRef(value: any): value is SchemaRef<unknown> {
  return value && value.__$isRef === true
}

/**
 * Returns the field value for a given pointer. If pointer starts
 * with `/`, then it will be searched from the root of the
 * object, otherwise it's searched from the nearest tip
 */
export function getFieldValue(field: string, root: any, tip: any) {
  return field[0] === '/' ? lodash.get(root, field.slice(1)) : tip[field]
}

/**
 * Resolves the field name in relation to the other field. If field name
 * starts with `/` it is returned as it is by removing `/`. Otherwise
 * the other field pointer is used to make the absolute name
 */
export function resolveAbsoluteName(field: string, otherField: string): string {
  return field[0] === '/'
    ? field.slice(1)
    : otherField.split('.').slice(0, -1).concat(field).join('.')
}

/**
 * Validates to ensure that arguments passed to validations compile method
 * is an array
 */
export function ensureValidArgs(ruleName: string, args: any): asserts args is any[] {
  /**
   * The compile method must receive an array of spread arguments. If not
   * it means the user has not used `Rules.<rule>` in order to use the
   * validation rule, since `Rules.<rule>` always passes an array of
   * options.
   */
  if (!Array.isArray(args)) {
    throw new Error(`"${ruleName}": The 3rd argument must be a combined array of arguments`)
  }
}

/**
 * Wraps the custom compile function to DRY the repetitive code inside every
 * validation rule.
 *
 * - It ensures that options received by the compile methods is a valid array.
 * - Validates for the restricted subtypes (if defined)
 * - Prepares a default set of parsedRules properties.
 * - Invokes the callback (if defined).
 */
export function wrapCompile<T extends any, SubType extends NodeSubType = NodeSubType>(
  name: string,
  restrictForTypes?: SubType[],
  customCallback?: (
    options: any[],
    type: NodeType,
    subtype: SubType,
    rulesTree: any
  ) => Partial<ParsedRule<T>>
) {
  return function (type: NodeType, subtype: SubType, options: T, rulesTree: any): ParsedRule<T> {
    /**
     * Ensure options are defined as an array
     */
    ensureValidArgs(name, options)

    /**
     * Restrict sub-types when defined
     */
    if (restrictForTypes && restrictForTypes.length && !restrictForTypes.includes(subtype)) {
      throw new Error(
        `"${name}": Rule can only be used with "schema.<${restrictForTypes.join(',')}>" type(s)`
      )
    }

    /**
     * Default options
     */
    const defaultOptions: ParsedRule<T> = {
      name: name,
      allowUndefineds: false,
      async: false,
      compiledOptions: options,
    }

    /**
     * Invoke user defined callback and merge return value with defaults
     */
    if (typeof customCallback === 'function') {
      Object.assign(defaultOptions, customCallback(options, type, subtype, rulesTree))
    }

    return defaultOptions
  }
}

/**
 * Returns the error reporter for the current HTTP request
 */
export function getRequestReporter(request: Request): ErrorReporterConstructorContract {
  if (request.ajax()) {
    return ErrorReporters.ApiErrorReporter
  }

  switch (request.accepts(['html', 'application/vnd.api+json', 'json'])) {
    case 'html':
    case null:
      return ErrorReporters.VanillaErrorReporter
    case 'json':
      return ErrorReporters.ApiErrorReporter
    case 'application/vnd.api+json':
      return ErrorReporters.JsonApiErrorReporter
  }
}

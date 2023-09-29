/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'

import { wrapCompile } from '../../Validator/helpers'
import { toLuxon } from '../date/helpers/toLuxon'
import { DateTimeOptions } from 'luxon'

const RULE_NAME = 'date'
const DEFAULT_MESSAGE = 'date validation failed'
const CANNOT_VALIDATE = 'cannot validate date instance against a date format'

/**
 * Ensure the value is a valid date instance
 */
export const date: SyncValidation<{ format?: string; opts?: DateTimeOptions }> = {
  compile: wrapCompile(RULE_NAME, [], ([options]) => {
    return {
      compiledOptions: {
        format: options && options.format,
        opts: options && options.opts,
      },
    }
  }),
  validate(value, compiledOptions, { mutate, errorReporter, pointer, arrayExpressionPointer }) {
    const isDateInstance = value instanceof Date
    const dateTime = toLuxon(value, compiledOptions.format, compiledOptions.opts)

    if (isDateInstance && compiledOptions.format) {
      errorReporter.report(pointer, RULE_NAME, CANNOT_VALIDATE, arrayExpressionPointer, {
        format: compiledOptions.format,
      })
      return
    }

    /**
     * If `dateTime` is still undefined, it means it is not an instance of
     * date or a string and we must report the error and return early.
     */
    if (!dateTime) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
        format: compiledOptions.format,
      })
      return
    }

    /**
     * Report error for invalid dates
     */
    if (!dateTime.isValid) {
      errorReporter.report(
        pointer,
        `${RULE_NAME}.format`,
        dateTime.invalidExplanation!,
        arrayExpressionPointer,
        { format: compiledOptions.format }
      )
      return
    }

    /**
     * Mutate original value to datetime
     */
    mutate(dateTime)
  },
}

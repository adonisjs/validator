/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { DateTime, DateTimeOptions } from 'luxon'

/**
 * A list of pre-defined formats and their luxon specific methods
 */
const PREDEFINED_FORMATS = {
  rfc2822: 'fromRFC2822',
  http: 'fromHTTP',
  sql: 'fromSQL',
  iso: 'fromISO',
}

/**
 * Convers a value to an instance of datetime
 */
export function toLuxon(
  value: any,
  format: string | undefined,
  opts: DateTimeOptions | undefined
): DateTime | undefined {
  let dateTime: DateTime | undefined

  /**
   * If value is a date instance or a string, then convert it to an instance
   * of luxon.DateTime.
   */
  if (value instanceof Date === true) {
    dateTime = DateTime.fromJSDate(value)
  } else if (DateTime.isDateTime(value)) {
    dateTime = value
  } else if (typeof value === 'string') {
    const formatterFn = PREDEFINED_FORMATS[format || 'iso']
    dateTime = formatterFn
      ? DateTime[formatterFn](value, opts)
      : DateTime.fromFormat(value, format!, opts)
  }

  return dateTime
}

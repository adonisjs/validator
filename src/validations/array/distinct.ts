/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '../../types.js'
import { wrapCompile } from '../../validator/helpers.js'

const RULE_NAME = 'distinct'
const DEFAULT_MESSAGE = 'distinct validation failed'

/**
 * Ensure that the value of one or more properties inside an array are distinct
 */
export const distinct: SyncValidation<{ field: string }> = {
  compile: wrapCompile(RULE_NAME, ['array'], ([field]) => {
    if (typeof field !== 'string' || !field) {
      throw new Error(`${RULE_NAME}: expects a "field" property`)
    }

    return {
      compiledOptions: {
        field,
      },
    }
  }),
  validate(values, { field }, { errorReporter, pointer, arrayExpressionPointer }) {
    if (!Array.isArray(values)) {
      return
    }

    const processed: Set<any> = new Set()
    for (let item of values) {
      /**
       * If field is a `*`, then we are dealing with top level array nodes
       */
      const value = field === '*' ? item : item[field]

      /**
       * Value already exists, hence a duplicate
       */
      if (processed.has(value)) {
        errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer, {
          field: field === '*' ? processed.size : field,
          index: processed.size,
        })
        processed.clear()
        break
      } else {
        processed.add(value)
      }
    }
  },
}

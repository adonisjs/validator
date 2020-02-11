/*
* @adonisjs/ace
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'
import { validator } from '@ioc:Adonis/Core/Validator'

/**
 * Extends the request class by adding `validate` method
 * to it
 */
export default function extendRequest (
  Request: RequestConstructorContract,
  validate: typeof validator['validate'],
) {
  Request.macro('validate', function validateRequest (schema: any, messages?: any, config?: any) {
    return validate(schema, {
      ...this.all(),
      ...this.allFiles(),
    }, messages, config)
  })
}

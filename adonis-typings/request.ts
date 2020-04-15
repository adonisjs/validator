/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import {
  TypedSchema,
  RequestValidatorNode,
  ParsedTypedSchema,
} from '@ioc:Adonis/Core/Validator'

declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    /**
     * Validate current request. The data is optional here, since request
     * can pre-fill it for us
     */
    validate <T extends ParsedTypedSchema<TypedSchema>> (validator: RequestValidatorNode<T>): Promise<T['props']>
  }
}

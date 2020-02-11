/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

declare module '@ioc:Adonis/Core/Request' {
  import {
    TypedSchema,
    ParsedTypedSchema,
    ErrorReporterConstructorContract,
  } from '@ioc:Adonis/Core/Validator'

  interface RequestContract {
    /**
     * Validate current request data using a pre-parsed
     * schema
     */
    validate <T extends ParsedTypedSchema<TypedSchema>> (
      schema: T,
      messages?: { [key: string]: string },
      options?: {
        cacheKey?: string,
        reporter?: ErrorReporterConstructorContract,
        bail?: boolean,
      }
    ): Promise<T['props']>
  }
}

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
    ValidatorNode,
    ParsedTypedSchema,
    ErrorReporterConstructorContract,
  } from '@ioc:Adonis/Core/Validator'

  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

  interface RequestContract {
    /**
     * Validate current request. The data is optional here, since request
     * can pre-fill it for us
     */
    validate <T extends ParsedTypedSchema<TypedSchema>> (
      validator: WithOptional<ValidatorNode<T>, 'data'>,
    ): Promise<T['props']>
  }
}

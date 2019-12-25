/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/// <reference path="./validator.ts" />

declare module '@ioc:Adonis/Core/Request' {
  import {
    SchemaContract,
    MessagesContract,
    TypedSchemaContract,
    ValidatorConfigContract,
  } from '@ioc:Adonis/Core/Validator'

  /**
   * Adding `validate` and `validateUsing` custom methods
   */
  interface RequestContract {
    validate<T extends TypedSchemaContract | SchemaContract> (
      schema: SchemaContract,
      messages?: MessagesContract,
      config?: Partial<ValidatorConfigContract>,
    ): Promise<T extends SchemaContract ? Promise<any> : Promise<T['props']>>

    validateUsing<T extends TypedSchemaContract | SchemaContract> (
      data: any,
      schema: SchemaContract,
      messages?: MessagesContract,
      config?: Partial<ValidatorConfigContract>,
    ): Promise<T extends SchemaContract ? Promise<any> : Promise<T['props']>>
  }
}

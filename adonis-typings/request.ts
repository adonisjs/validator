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
    ValidatorConfigContract,
  } from '@ioc:Adonis/Core/Validator'

  /**
   * Adding `validate` and `validateAll` custom methods
   */
  interface RequestContract {
    validate<T extends any> (
      schema: SchemaContract,
      messages?: MessagesContract,
      config?: Partial<ValidatorConfigContract>,
    ): Promise<T>

    validateUsing<T extends any> (
      data: any,
      schema: SchemaContract,
      messages?: MessagesContract,
      config?: Partial<ValidatorConfigContract>,
    ): Promise<T>
  }
}

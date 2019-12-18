/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

declare module '@ioc:Adonis/Core/Validator' {
  import { ValidatorConfig } from 'indicative/src/Contracts'
  import { VanillaFormatter, JsonApiFormatter } from 'indicative-formatters'
  import { ValidationDefination, ErrorFormatterContract } from 'indicative-compiler'
  import { Schema, Messages, ParsedTypedSchema, TypedSchema } from 'indicative-parser'
  import { t, ValidationRulesContract as BaseRulesContract } from 'indicative/validator'

  /**
   * Error formatter interface to create custom formatters.
   */
  export interface ValidatorFormatterContract extends ErrorFormatterContract {}

  /**
   * Validation rules interface that must be extended whenever
   * a new rule is added using extend
   */
  export interface ValidationsContract extends BaseRulesContract {}

  /**
   * Shape of validator config.
   */
  export type ValidatorConfigContract = ValidatorConfig

  /**
   * Copy of schema
   */
  export type SchemaContract = Schema

  /**
   * Shape of typed schema
   */
  export type TypedSchemaContract = ParsedTypedSchema<TypedSchema>

  /**
   * Copy of messages
   */
  export type MessagesContract = Messages

  /**
   * Copy of validation definition
   */
  export type ValidationDefinitionContract = ValidationDefination

  /**
   * Validate and stop on first error
   */
  export function validate<T extends TypedSchemaContract | SchemaContract> (
    data: any,
    schema: T,
    messages?: MessagesContract,
    config?: Partial<ValidatorConfigContract>
  ): Promise<T extends SchemaContract ? Promise<any> : Promise<T['props']>>

  /**
   * Validate all
   */
  export function validateAll<T extends TypedSchemaContract | SchemaContract> (
    data: any,
    schema: T,
    messages?: MessagesContract,
    config?: Partial<ValidatorConfigContract>
  ): Promise<T extends SchemaContract ? Promise<any> : Promise<T['props']>>

  /**
   * Extend validator by adding new validation rules. Newly added
   * rule make their way back to indicative validations.
   */
  export const extend: (name: string, defination: ValidationDefinitionContract) => void

  /**
   * A copy of validations to be used as rules
   */
  export const validations: ValidationsContract

  /**
   * Collection of default formatters
   */
  export const formatters: {
    vanilla: typeof VanillaFormatter,
    jsonapi: typeof JsonApiFormatter,
  }

  export { t as schema }
}

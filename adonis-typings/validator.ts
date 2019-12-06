/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

declare module '@ioc:Adonis/Core/Validator' {
  import { Schema, Messages } from 'indicative-parser'
  import { ValidatorConfig } from 'indicative/src/Contracts'
  import { ValidationDefination, ErrorFormatterContract } from 'indicative-compiler'
  import { ValidationRulesContract as BaseRulesContract } from 'indicative/validator'
  import { VanillaFormatter, JsonApiFormatter } from 'indicative-formatters'

  /**
   * Error formatter interface to create custom formatters.
   */
  export interface ValidatorFormatterContract extends ErrorFormatterContract {}

  /**
   * Validation rules interface that must be extended whenever
   * a new rule is added using extend
   */
  export interface ValidationRulesContract extends BaseRulesContract {}

  /**
   * Shape of validator config.
   */
  export type ValidatorConfigContract = ValidatorConfig

  /**
   * Copy of schema
   */
  export type SchemaContract = Schema

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
  export function validate<T extends any = any> (
    data: any,
    schema: SchemaContract,
    messages?: MessagesContract,
    config?: Partial<ValidatorConfigContract>
  ): Promise<T>

  /**
   * Validate all
   */
  export function validateAll<T extends any = any> (
    data: any,
    schema: SchemaContract,
    messages?: MessagesContract,
    config?: Partial<ValidatorConfigContract>
  ): Promise<T>

  /**
   * Extend validator by adding new validation rules. Newly added
   * rule make their way back to indicative validations.
   */
  export const extend: (name: string, defination: ValidationDefinitionContract) => void

  /**
   * A copy of validations to be used a rules
   */
  export const validations: ValidationRulesContract

  /**
   * Collection of default formatters
   */
  export const formatters: {
    vanilla: typeof VanillaFormatter,
    jsonapi: typeof JsonApiFormatter,
  }
}

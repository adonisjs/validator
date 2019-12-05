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
  import { ValidationDefination } from 'indicative-compiler'
  import { ValidatorConfig } from 'indicative/src/Contracts'
  import { ValidationRulesContract as BaseRulesContract } from 'indicative/validator'

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
   * Validator to run validations on a given schema with runtime
   * data. The validator can only be used once
   */
  export interface ValidatorContract<ValidatedData extends any> {
    schema: SchemaContract,
    messages?: MessagesContract,
    validatedData?: ValidatedData,
    isValidated: boolean,
    isValid: boolean
    hasErrors: boolean
    errors: any[]

    validate (data: any, config?: Partial<ValidatorConfigContract>): Promise<void>
    validateAll (data: any, config?: Partial<ValidatorConfigContract>): Promise<void>
  }

  /**
   * Shape of validator static properties.
   */
  export interface ValidatorConstructorContract {
    new<ValidatedData extends any> (
      schema: SchemaContract,
      messages?: MessagesContract
    ): ValidatorContract<ValidatedData>

    /**
     * Extend validator by adding new validation rules. Newly added
     * rule make their way back to indicative validations.
     */
    extend: (name: string, defination: ValidationDefinitionContract) => void
  }

  /**
   * A copy of validations to be used a rules
   */
  export const validations: ValidationRulesContract

  /**
   * Validator
   */
  export const Validator: ValidatorConstructorContract
}

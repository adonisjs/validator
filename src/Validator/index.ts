/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/// <reference path="../../adonis-typings/validator.ts" />

import { JsonApiFormatter, VanillaFormatter } from 'indicative-formatters'
import { validateAll, validate, extend, validations, schema } from 'indicative/validator'

import {
  SchemaContract,
  MessagesContract,
  TypedSchemaContract,
  ValidatorConfigContract,
  ValidationDefinitionContract,
} from '@ioc:Adonis/Core/Validator'

import { ValidationException } from '../Exceptions/ValidationException'

/**
 * Exposes the API to validate data using the schema object.
 */
export class Validator {
  constructor (private config: Partial<ValidatorConfigContract>) {}

  /**
   * Extend validations by adding a new rule
   */
  public extend (name: string, definition: ValidationDefinitionContract): void {
    extend(name, definition)
  }

  /**
   * A copy of validations to use in favor of string
   * based rules
   */
  public validations = validations

  /**
   * Collection of default formatters
   */
  public formatters = {
    vanilla: VanillaFormatter,
    jsonapi: JsonApiFormatter,
  }

  /**
   * Identifier to create declarative schema
   */
  public schema = schema

  /**
   * Validate data against the pre-defined schema and messages
   */
  public async validate<T extends TypedSchemaContract | SchemaContract> (
    data: any,
    validationSchema: T,
    messages?: MessagesContract,
    config?: Partial<ValidatorConfigContract>,
  ): Promise<T extends SchemaContract ? Promise<any> : Promise<T['props']>> {
    try {
      config = Object.assign({}, this.config, config)
      const validated = await validate(data, validationSchema, messages, config)
      return validated
    } catch (error) {
      if (Array.isArray(error)) {
        throw new ValidationException(error)
      } else {
        throw error
      }
    }
  }

  /**
   * Validate data against the pre-defined schema and messages using
   * validate all.
   */
  public async validateAll<T extends TypedSchemaContract | SchemaContract> (
    data: any,
    validationSchema: T,
    messages?: MessagesContract,
    config?: Partial<ValidatorConfigContract>,
  ): Promise<T extends SchemaContract ? Promise<any> : Promise<T['props']>> {
    try {
      config = Object.assign({}, this.config, config)
      const validated = await validateAll(data, validationSchema, messages, config)
      return validated
    } catch (error) {
      if (Array.isArray(error)) {
        throw new ValidationException(error)
      } else {
        throw error
      }
    }
  }
}

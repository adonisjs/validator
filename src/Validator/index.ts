/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/// <reference path="../../adonis-typings/validator.ts" />

import { validateAll, validate, extend } from 'indicative/validator'
import {
  SchemaContract,
  MessagesContract,
  ValidatorContract,
  ValidatorConfigContract,
  ValidationDefinitionContract,
  ValidatorConstructorContract,
} from '@ioc:Adonis/Core/Validator'

function StaticImplements<T> () {
  return (_t: T): void => {}
}

/**
 * Exposes the API to validate data using the schema object.
 */
@StaticImplements<ValidatorConstructorContract>()
export class Validator<T extends any> implements ValidatorContract<T> {
  public isValid = false
  public hasErrors = false
  public isValidated = false
  public errors = []
  public validatedData?: T

  constructor (
    public schema: SchemaContract,
    public messages?: MessagesContract,
    private _cacheKey?: string,
  ) {}

  /**
   * Stopping validator instance from being re-used
   */
  private _ensureIsntValidated (): void {
    if (this.isValidated) {
      throw new Error('Cannot re-use validator instance to peform multiple validations')
    }
  }

  /**
   * Extend validations by adding a new rule
   */
  public static extend (name: string, definition: ValidationDefinitionContract): void {
    extend(name, definition)
  }

  /**
   * Validate data against the pre-defined schema and messages
   */
  public async validate (
    data: any,
    config?: Partial<ValidatorConfigContract>,
  ): Promise<void> {
    this._ensureIsntValidated()

    config = Object.assign({ cacheKey: this._cacheKey }, config)
    this.isValidated = true

    try {
      this.validatedData = await validate(data, this.schema, this.messages, config)
      this.isValid = true
    } catch (error) {
      this.isValid = false
      this.hasErrors = true
      this.errors = error
    }
  }

  /**
   * Validate data against the pre-defined schema and messages using
   * validate all.
   */
  public async validateAll (
    data: any,
    config?: Partial<ValidatorConfigContract>,
  ): Promise<void> {
    this._ensureIsntValidated()

    config = Object.assign({ cacheKey: this._cacheKey }, config)
    this.isValidated = true

    try {
      this.validatedData = await validateAll(data, this.schema, this.messages, config)
      this.isValid = true
    } catch (error) {
      this.isValid = false
      this.hasErrors = true
      this.errors = error
    }
  }
}

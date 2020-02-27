/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

declare module '@ioc:Adonis/Core/Validator' {
  import { DateTime } from 'luxon'
  import { MultipartFileContract, FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'

  export type Rule = {
    name: string,
    options?: any,
  }

  /**
   * The shape of rule after it has been passed
   */
  export type ParsedRule<Options extends any = any> = {
    name: string
    async: boolean
    allowUndefineds: boolean
    compiledOptions: Options
  }

  /**
   * Shape of schema core literal type
   */
  export type SchemaLiteral = {
    type: 'literal',
    subtype: string,
    rules: ParsedRule[],
  }

  /**
   * Shape of schema core object type
   */
  export type SchemaObject = {
    type: 'object',
    rules: ParsedRule[],
    children: ParsedSchemaTree,
  }

  /**
   * Shape of schema core array type
   */
  export type SchemaArray = {
    type: 'array',
    rules: ParsedRule[],
    each?: SchemaLiteral | SchemaObject | SchemaArray,
  }

  /**
   * Shape of parsed schema tree. This is not extensible. All newly
   * added rules will be of type literal.
   */
  export type ParsedSchemaTree = {
    [key: string]: SchemaLiteral | SchemaObject | SchemaArray,
  }

  /**
   * The runtime values passed to a validation runtime
   */
  export type ValidationRuntimeOptions = {
    root: any,
    tip: any,
    pointer: string,
    arrayExpressionPointer?: string,
    errorReporter: ErrorReporterContract,
    mutate: ((newValue: any) => void),
  }

  /**
   * Compiler internal representation of a field to produce
   * the compiled output
   */
  export type ValidationField = {
    name: string,
    type: 'literal' | 'identifier',
  }

  /**
   * Shape of an async validation function
   */
  export type AsyncValidation<T extends any = undefined> = {
    compile (type: 'array' | 'object' | 'literal', subtype: string, options?: any): ParsedRule<T>
    validate (
      value: any,
      compiledOptions: any,
      runtimeOptions: ValidationRuntimeOptions,
    ): Promise<void>
  }

  /**
   * Shape of an sync validation function
   */
  export type SyncValidation<T extends any = undefined> = {
    compile (
      type: 'array' | 'object' | 'literal',
      subtype: string,
      options?: any,
    ): ParsedRule<T>
    validate (
      value: any,
      compiledOptions: T,
      runtimeOptions: ValidationRuntimeOptions,
    ): void
  }

  /**
   * The interface that every error reporter must adhere
   * to.
   */
  export interface ErrorReporterContract<Messages extends any = any> {
    hasErrors: boolean
    report (
      pointer: string,
      rule: string,
      message?: string,
      arrayExpressionPointer?: string,
      args?: any
    ): void
    toError (): any,
    toJSON (): Messages
  }

  /**
   * The reporter constructor contract
   */
  export interface ErrorReporterConstructorContract<Messages extends any = any> {
    new (
      userMessages: { [key: string]: string },
      bail: boolean,
    ): ErrorReporterContract<Messages>
  }

  /**
   * The contract every validation must adhere to
   */
  export type ValidationContract<T> = AsyncValidation<T> | SyncValidation<T>

  /**
   * The compiler output function
   */
  export interface CompilerOutput<T extends any> {
    (
      data: any,
      validations: { [rule: string]: ValidationContract<any> },
      errorReporter: ErrorReporterContract,
      helpers: { exists: ((value: any) => boolean), isObject: ((value: any) => boolean) }
    ): Promise<T>
  }

  /**
   * Typed schema is a key-value pair of the `field` and a schema
   * function that returns `getTree` method and optional `type`
   * for it
   */
  export type TypedSchema = {
    [field: string]: {
      t?: any,
      getTree (): SchemaLiteral | SchemaObject | SchemaArray,
    }
  }

  /**
   * Signature to define a string or optional string type
   */
  export interface StringType {
    (options?: { escape?: boolean, trim?: boolean }, rules?: Rule[]): {
      t: string,
      getTree (): SchemaLiteral
    },
    optional (options?: { escape?: boolean, trim?: boolean }, rules?: Rule[]): {
      t?: string,
      getTree (): SchemaLiteral
    },
  }

  /**
   * Signature to define a date or an optional date type
   */
  export interface DateType {
    (options?: { format?: string }, rules?: Rule[]): {
      t: DateTime,
      getTree (): SchemaLiteral
    },
    optional (options?: { format?: string }, rules?: Rule[]): {
      t?: DateTime,
      getTree (): SchemaLiteral
    },
  }

  /**
   * Signature to define a boolean or optional boolean type
   */
  export interface BooleanType {
    (rules?: Rule[]): {
      t: boolean,
      getTree (): SchemaLiteral
    },
    optional (rules?: Rule[]): {
      t?: boolean,
      getTree (): SchemaLiteral
    },
  }

  /**
   * Signature to define a number or optional number type
   */
  export interface NumberType {
    (rules?: Rule[]): {
      t: number,
      getTree (): SchemaLiteral
    },
    optional (rules?: Rule[]): {
      t?: number,
      getTree (): SchemaLiteral
    },
  }

  /**
   * Signature to define an object with members or an optional object
   * with members.
   */
  export interface ObjectType {
    (rules?: Rule[]): {
      members<T extends TypedSchema> (schema: T): {
        t: { [P in keyof T]: T[P]['t'] },
        getTree (): SchemaObject
      }
    },
    optional (rules?: Rule[]): {
      members <T extends TypedSchema>(schema: T): {
        t?: { [P in keyof T]: T[P]['t'] },
        getTree (): SchemaObject
      }
    },
  }

  /**
   * Signature to define an array with members or an optional array
   * with members or array/optional array with optional members
   */
  export interface ArrayType {
    (rules?: Rule[]): {
      members <T extends { t?: any, getTree (): SchemaLiteral | SchemaObject | SchemaArray }> (schema: T): {
        t: T['t'][],
        getTree (): SchemaArray
      },
      anyMembers (): {
        t: any[],
        getTree (): SchemaArray
      }
    },
    optional (rules?: Rule[]): {
      members <T extends { t?: any, getTree (): SchemaLiteral | SchemaObject | SchemaArray }> (schema: T): {
        t?: T['t'][],
        getTree (): SchemaArray
      },
      anyMembers (): {
        t?: any[],
        getTree (): SchemaArray
      }
    },
  }

  /**
   * Signature to define an enum type
   */
  export interface EnumType {
    <Options extends any> (options: readonly Options[], rules?: Rule[]): {
      t: Options,
      getTree (): SchemaLiteral
    },
    optional<Options extends any> (options: readonly Options[], rules?: Rule[]): {
      t?: Options,
      getTree (): SchemaLiteral
    },
  }

  /**
   * Signature to define an enum set type
   */
  export interface EnumSetType {
    <Options extends any> (options: readonly Options[], rules?: Rule[]): {
      t: Options[],
      getTree (): SchemaLiteral
    },
    optional<Options extends any> (options: readonly Options[], rules?: Rule[]): {
      t?: Options[],
      getTree (): SchemaLiteral
    },
  }

  /**
   * Type for validating multipart files
   */
  export interface FileType {
    (options?: Partial<FileValidationOptions>, rules?: Rule[]): {
      t: MultipartFileContract,
      getTree (): SchemaLiteral
    },
    optional (options?: Partial<FileValidationOptions>, rules?: Rule[]): {
      t?: MultipartFileContract,
      getTree (): SchemaLiteral
    }
  }

  /**
   * Shape of `schema.create` output
   */
  export type ParsedTypedSchema<T extends TypedSchema> = {
    props: { [P in keyof T]: T[P]['t'] },
    tree: ParsedSchemaTree,
  }

  /**
   * List of schema methods available to define a schema
   */
  export interface Schema {
    string: StringType,
    boolean: BooleanType,
    number: NumberType,
    date: DateType,
    enum: EnumType,
    enumSet: EnumSetType,
    object: ObjectType,
    array: ArrayType,
    file: FileType,
    create <T extends TypedSchema> (schema: T): ParsedTypedSchema<T>
  }

  /**
   * Shape of validator config
   */
  export type ValidatorConfig = {
    bail: boolean,
    reporter: ErrorReporterConstructorContract,
  }

  /**
   * Compile the schema and cache it using a cache key
   */
  export interface CompileAndCache {
    <T extends ParsedTypedSchema<TypedSchema>> (
      schema: T,
      cacheKey: string,
    ): CompilerOutput<T['props']>
  }

  /**
   * Compile function signature
   */
  export interface CompileFn {
    <T extends ParsedTypedSchema<TypedSchema>> (schema: T): CompilerOutput<T['props']>
  }

  /**
   * Shape of the function that validates the compiler output
   */
  export interface ValidateFn {
    <Fn extends (...args: any) => any> (
      validator: {
        schema: Fn,
        data: any,
        messages?: { [key: string]: string },
        existsStrict?: boolean,
        reporter?: ErrorReporterConstructorContract,
        bail?: boolean,
      }
    ): ReturnType<Fn>
  }

  /**
   * Email validation and sanitization options
   */
  export type EmailRuleOptions = {
    domainSpecificValidation?: boolean,
    allowIpDomain?: boolean,
    ignoreMaxLength?: boolean,
    sanitize?: boolean | {
      lowerCase: boolean,
    },
  }

  /**
   * List of available validation rules. The rules are not the validation
   * implementations, but instead a pointer to the validation implementation
   * by it's name.
   *
   * Do not add primitives here, since they are covered by the types. For example
   * schema.string will add rules.string automatically.
   */
  export interface Rules {
    /**
     * Field under validation must always exists
     */
    required (): Rule

    /**
     * Field under validation must always exists if the
     * target field exists
     */
    requiredIfExists (field: string): Rule

    /**
     * Field under validation must always exists, if all of the
     * target field exists
     */
    requiredIfExistsAll (field: string[]): Rule

    /**
     * Field under validation must always exists, if any of the
     * target fields exists
     */
    requiredIfExistsAny (field: string[]): Rule

    /**
     * Field under validation must always exists, if target field
     * does not exists
     */
    requiredIfNotExists (field: string): Rule

    /**
     * Field under validation must always exists, if all of the
     * target fields does not exists
     */
    requiredIfNotExistsAll (field: string[]): Rule

    /**
     * Field under validation must always exists, if any of the
     * target fields does not exists
     */
    requiredIfNotExistsAny (field: string[]): Rule

    /**
     * Field under validation must always exists, when the defined
     * expecations are met
     */
    requiredWhen (
      field: string,
      operator: 'in' | 'notIn',
      comparisonValues: any[]
    ): Rule
    requiredWhen (
      field: string,
      operator: '>' | '<' | '>=' | '<=',
      comparisonValues: number,
    ): Rule
    requiredWhen (
      field: string,
      operator: 'in' | 'notIn' | '=' | '!=' | '>' | '<' | '>=' | '<=',
      comparisonValues: any
    ): Rule

    /**
     * Number must be unsigned
     */
    unsigned (): Rule

    /**
     * String must be alpha
     */
    alpha (): Rule
    email (options?: EmailRuleOptions): Rule
    ip (options?: { version?: '4' | '6' }): Rule

    /**
     * String or array must have defined maximum length
     */
    maxLength (length: number): Rule
  }

  /**
   * Shape of schema module
   */
  const schema: Schema

  /**
   * Shape of rules module
   */
  const rules: Rules

  /**
   * Shape of validator module
   */
  const validator: {
    /**
     * Validate is a shorthand to compile + exec. If cache
     * key is defined, then it will also cache the
     * schemas.
     */
    validate: ValidateFn,

    /**
     * Compile schema to an executable function
     */
    compile: CompileFn,

    /**
     * Compile and cache schema using a cache key
     */
    compileAndCache: CompileAndCache,

    /**
     * Add a new validation rule
     */
    addRule (name: string, ruleDefinition: ValidationContract<any>): void

    /**
     * Type definition is set to any, since one can pass in a function or
     * an object that has chainable API. So there is no simple way
     * to guard the type definition. However, the `schema.create`
     * method will fail if the final outcome doesn't have `getTree`
     * method on it.
     */
    addType (name: string, typeDefinition: any): void
  }

  export { schema, rules, validator }
}

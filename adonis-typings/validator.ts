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
  import { UUIDVersion } from 'validator/lib/isUUID'
  import { default as validatorJs } from 'validator'
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import { MultipartFileContract, FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'

  /**
   * Helper
   */
  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

  /**
   * Shape of a rule. This is what methods from the
   * rules object returns
   */
  export type Rule = {
    name: string,
    options?: any,
  }

  export type SchemaRef<T extends unknown> = {
    readonly __$isRef: true,
    value: T,
    key: string,
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
    field: string,
    pointer: string,
    refs: { [key: string]: SchemaRef<unknown> },
    arrayExpressionPointer?: string,
    errorReporter: ErrorReporterContract,
    mutate: ((newValue: any) => void),
  }

  export type NodeType = 'array' | 'object' | 'literal'
  export type NodeSubType = Exclude<keyof Schema, 'create' | 'refs'>

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
  export type AsyncValidation<T extends any = unknown> = {
    compile (type: NodeType, subtype: NodeSubType, options?: any): ParsedRule<T>
    validate (value: any, compiledOptions: T, runtimeOptions: ValidationRuntimeOptions): Promise<void>
  }

  /**
   * Shape of an sync validation function
   */
  export type SyncValidation<T extends any = unknown> = {
    compile (type: NodeType, subtype: NodeSubType, options?: any): ParsedRule<T>
    validate (value: any, compiledOptions: T, runtimeOptions: ValidationRuntimeOptions): void
  }

  /**
   * Shape of custom messages accepted the validator
   */
  export type CustomMessages = {
    '*'?: ((
      field: string,
      rule: string,
      arrayExpressionPointer?: string,
      args?: any,
    ) => string)
  } | {
    [key: string]: string
  }

  /**
   * Returns the most appropriate message for the current
   * validation error.
   */
  export interface MessagesBagContract {
    get (
      pointer: string,
      rule: string,
      message: string,
      arrayExpressionPointer?: string,
      args?: any,
    ): string
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
      messages: MessagesBagContract,
      bail: boolean,
    ): ErrorReporterContract<Messages>
  }

  /*
  |--------------------------------------------------------------------------
  | JSON API Error Reporter
  |--------------------------------------------------------------------------
  */

  /**
   * Shape of the JSON API error node
   */
  export type JsonApiErrorNode = {
    source: {
      pointer: string,
    }
    code: string,
    title: string,
    meta?: any,
  }

  /*
  |--------------------------------------------------------------------------
  | API Error Reporter
  |--------------------------------------------------------------------------
  */
  /**
   * Shape of the API error node
   */
  export type ApiErrorNode = {
    message: string,
    field: string,
    rule: string,
    args?: any,
  }

  /*
  |--------------------------------------------------------------------------
  | Vanilla Error Reporter
  |--------------------------------------------------------------------------
  */
  /**
   * Shape of the Vanilla error node
   */
  export type VanillaErrorNode = { [field: string]: string[] }

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
      helpers: { exists: ((value: any) => boolean), isObject: ((value: any) => boolean) },
      refs: { [key: string]: SchemaRef<unknown> },
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
   * Options accepted by the enum type
   */
  export type AllowedEnumOptions = SchemaRef<unknown> | readonly unknown[]

  /**
   * Conditionally finds the return value for the Enum options
   */
  export type EnumReturnValue<Options extends AllowedEnumOptions> =
    Options extends SchemaRef<infer R>
      ? R extends readonly unknown[] ? R[number] : unknown
      : Options extends readonly unknown[] ? Options[number] : never

  /**
   * Conditionally finds the return value for the EnumSet options
   */
  export type EnumSetReturnValue<Options extends AllowedEnumOptions> =
    Options extends SchemaRef<infer R>
      ? R extends readonly unknown[] ? R[number][] : unknown
      : Options extends readonly unknown[] ? Options[number][] : never

  /**
   * Signature to define an enum type. We accept a static list of enum
   * values or a ref that is resolved lazily.
   */
  export interface EnumType {
    <Options extends AllowedEnumOptions> (
      options: Options,
      rules?: Rule[],
    ): {
      t: EnumReturnValue<Options>,
      getTree (): SchemaLiteral
    },
    optional<Options extends AllowedEnumOptions> (
      options: Options,
      rules?: Rule[],
    ): {
      t?: EnumReturnValue<Options>,
      getTree (): SchemaLiteral
    },
  }

  /**
   * Signature to define an enum set type
   */
  export interface EnumSetType {
    <Options extends AllowedEnumOptions> (
      options: Options,
      rules?: Rule[],
    ): {
      t: EnumSetReturnValue<Options>,
      getTree (): SchemaLiteral
    },
    optional<Options extends AllowedEnumOptions> (
      options: Options,
      rules?: Rule[],
    ): {
      t?: EnumSetReturnValue<Options>,
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
    refs: <T extends Object>(refs: T) => { [K in keyof T]: SchemaRef<T[K]> },
    create <T extends TypedSchema> (schema: T): ParsedTypedSchema<T>,
  }

  /**
   * Shape of validator config
   */
  export type ValidatorConfig = {
    bail: boolean,
    reporter: ErrorReporterConstructorContract,
  }

  /**
   * The validator node object accepted by the validated
   * method
   */
  export type ValidatorNode<T extends ParsedTypedSchema<TypedSchema>> = {
    schema: T,
    data: any,
    refs?: { [key: string]: SchemaRef<unknown> },
    cacheKey?: string,
    messages?: CustomMessages,
    existsStrict?: boolean,
    reporter?: ErrorReporterConstructorContract,
    bail?: boolean,
  }

  /**
   * Shape of validator accepted by the request.validate function. It can be
   * a class with constructor that accepts the Context or a plain object
   * with properties accepted by the `validator.validate` method.
   */
  export type RequestValidatorNode<T extends ParsedTypedSchema<TypedSchema>> = (
    new (ctx: HttpContextContract) => WithOptional<ValidatorNode<T>, 'data'>
  ) | WithOptional<ValidatorNode<T>, 'data'>

  /**
   * Shape of the function that validates the compiler output
   */
  export type ValidateFn = <T extends ParsedTypedSchema<TypedSchema>> (
    validator: ValidatorNode<T>
  ) => Promise<T['props']>

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
      comparisonValues: any[] | SchemaRef<any[]>
    ): Rule
    requiredWhen (
      field: string,
      operator: '>' | '<' | '>=' | '<=',
      comparisonValues: number | SchemaRef<number>,
    ): Rule
    requiredWhen (
      field: string,
      operator: 'in' | 'notIn' | '=' | '!=' | '>' | '<' | '>=' | '<=',
      comparisonValues: any | SchemaRef<any>
    ): Rule

    /**
     * Number must be integer
     */
    integer (): Rule

    /**
     * Number must be unsigned
     */
    unsigned (): Rule

    /**
     * Number must be in a specific range of values
     */
    range (start: number, stop: number): Rule

    /**
     * String must be alpha
     */
    alpha (options?: { allow?: ('space' | 'underscore' | 'dash')[] }): Rule

    /**
     * String must match regex
     */
    regex (regexPattern: RegExp): Rule
    email (options?: EmailRuleOptions): Rule
    ip (options?: { version?: '4' | 4 | 6 | '6' }): Rule
    uuid (options?: { version?: UUIDVersion }): Rule
    mobile (options?: { strict?: boolean, locales?: validatorJs.MobilePhoneLocale[] }): Rule

    /**
     * String or array must have defined maximum length
     */
    maxLength (length: number): Rule
    minLength (length: number): Rule

    /**
     * Confirm field to be exists and have the same value
     */
    confirmed (): Rule
    distinct (field: string): Rule
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
     * Add a new validation rule
     */
    addRule (name: string, ruleDefinition: ValidationContract<any>): void

    /**
     * Add a new validation rule
     */
    rule<Options extends any> (
      name: string,
      validateFn: ValidationContract<Options>['validate'],
      compileFn?: (options: any[], type: NodeType, subtype: NodeSubType) => Partial<ParsedRule<Options>>,
      restrictForTypes?: NodeSubType[],
    ): void

    /**
     * Type definition is set to any, since one can pass in a function or
     * an object that has chainable API. So there is no simple way
     * to guard the type definition. However, the `schema.create`
     * method will fail if the final outcome doesn't have `getTree`
     * method on it.
     */
    addType (name: string, typeDefinition: any): void

    /**
     * Type definition is set to any, since one can pass in a function or
     * an object that has chainable API. So there is no simple way
     * to guard the type definition. However, the `schema.create`
     * method will fail if the final outcome doesn't have `getTree`
     * method on it.
     */
    type (name: string, typeDefinition: any): void

    /**
     * Helpers required by the custom rules
     */
    helpers: {
      getFieldValue: (field: string, root: any, tip: any) => any,
      exists: (value: any) => boolean,
      isRef (value: any): value is SchemaRef<unknown>,
      existsStrict: (value: any) => boolean,
    },

    /**
     * List of bundled reporters
     */
    reporters: {
      api: ErrorReporterConstructorContract<{ errors: ApiErrorNode[] }>,
      jsonapi: ErrorReporterConstructorContract<{ errors: JsonApiErrorNode[] }>,
      vanilla: ErrorReporterConstructorContract<VanillaErrorNode>,
    }
  }

  export { schema, rules, validator }
}

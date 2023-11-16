/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/Validator' {
  import { UUIDVersion } from 'validator/lib/isUUID'
  import { default as validatorJs } from 'validator'
  import { DateTime, DateTimeOptions, DurationObjectUnits } from 'luxon'
  import { RequestContract } from '@ioc:Adonis/Core/Request'
  import { Options as NormalizeUrlOptions } from 'normalize-url'
  import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
  import { MultipartFileContract, FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'

  /**
   * Accepted duration units. Luxon has removed support for
   * singular unit names, but we are supporting them to
   * avoid breaking changes
   */
  export type DurationUnits =
    | keyof DurationObjectUnits
    | 'year'
    | 'quarter'
    | 'month'
    | 'week'
    | 'day'
    | 'hour'
    | 'minute'
    | 'second'
    | 'millisecond'

  /**
   * Helper
   */
  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

  /**
   * Shape of a rule. This is what methods from the
   * rules object returns
   */
  export type Rule = {
    name: string
    options?: any
  }

  export type SchemaRef<T extends unknown> = {
    readonly __$isRef: true
    value: T
    key: string
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
    type: 'literal'
    subtype: string
    nullable: boolean
    optional: boolean
    rules: ParsedRule[]
  }

  /**
   * Shape of schema core object type
   */
  export type SchemaObject = {
    type: 'object'
    nullable: boolean
    optional: boolean
    rules: ParsedRule[]
    children?: ParsedSchemaTree
  }

  /**
   * Shape of schema core array type
   */
  export type SchemaArray = {
    type: 'array'
    nullable: boolean
    optional: boolean
    rules: ParsedRule[]
    each?: SchemaLiteral | SchemaObject | SchemaArray
  }

  /**
   * Shape of parsed schema tree. This is not extensible. All newly
   * added rules will be of type literal.
   */
  export type ParsedSchemaTree = {
    [key: string]: SchemaLiteral | SchemaObject | SchemaArray
  }

  /**
   * The runtime values passed to a validation runtime
   */
  export type ValidationRuntimeOptions = {
    root: any
    tip: any
    field: string
    pointer: string
    refs: { [key: string]: SchemaRef<unknown> }
    arrayExpressionPointer?: string
    errorReporter: ErrorReporterContract
    mutate: (newValue: any) => void
  }

  export type NodeType = 'array' | 'object' | 'literal'
  export type NodeSubType = Exclude<keyof Schema, 'create' | 'refs'>

  /**
   * Compiler internal representation of a field to produce
   * the compiled output
   */
  export type ValidationField = {
    name: string
    type: 'literal' | 'identifier'
  }

  /**
   * Shape of an async validation function
   */
  export type AsyncValidation<T extends any = unknown> = {
    compile(
      type: NodeType,
      subtype: NodeSubType,
      options?: any,
      rulesTree?: { [key: string]: any }
    ): ParsedRule<T>
    validate(
      value: any,
      compiledOptions: T,
      runtimeOptions: ValidationRuntimeOptions
    ): Promise<void>
  }

  /**
   * Shape of an sync validation function
   */
  export type SyncValidation<T extends any = unknown> = {
    compile(
      type: NodeType,
      subtype: NodeSubType,
      options?: any,
      rulesTree?: { [key: string]: any }
    ): ParsedRule<T>
    validate(value: any, compiledOptions: T, runtimeOptions: ValidationRuntimeOptions): void
  }

  /**
   * Shape of custom messages accepted the validator
   */
  export type CustomMessages =
    | {
        '*'?: (field: string, rule: string, arrayExpressionPointer?: string, args?: any) => string
      }
    | {
        [key: string]: string
      }

  /**
   * Returns the most appropriate message for the current
   * validation error.
   */
  export interface MessagesBagContract {
    get(
      pointer: string,
      rule: string,
      message: string,
      arrayExpressionPointer?: string,
      args?: any
    ): string
  }

  /**
   * The interface that every error reporter must adhere
   * to.
   */
  export interface ErrorReporterContract<Messages extends any = any> {
    hasErrors: boolean
    report(
      pointer: string,
      rule: string,
      message?: string,
      arrayExpressionPointer?: string,
      args?: any
    ): void
    toError(): any
    toJSON(): Messages
  }

  /**
   * The reporter constructor contract
   */
  export interface ErrorReporterConstructorContract<Messages extends any = any> {
    new (messages: MessagesBagContract, bail: boolean): ErrorReporterContract<Messages>
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
      pointer: string
    }
    code: string
    title: string
    meta?: any
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
    message: string
    field: string
    rule: string
    args?: any
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
      helpers: { exists: (value: any) => boolean; isObject: (value: any) => boolean },
      refs: { [key: string]: SchemaRef<unknown> }
    ): Promise<T>
  }

  /**
   * Typed schema is a key-value pair of the `field` and a schema
   * function that returns `getTree` method and optional `type`
   * for it
   */
  export type TypedSchema = {
    [field: string]: {
      t?: any
      getTree(): SchemaLiteral | SchemaObject | SchemaArray
    }
  }

  /**
   * Signature to define a string or optional string type
   */
  export interface StringType {
    (options?: { escape?: boolean; trim?: boolean } | Rule[], rules?: Rule[]): {
      t: string
      getTree(): SchemaLiteral
    }
    optional(
      options?: { escape?: boolean; trim?: boolean } | Rule[],
      rules?: Rule[]
    ): {
      t?: string
      getTree(): SchemaLiteral
    }
    nullable(
      options?: { escape?: boolean; trim?: boolean } | Rule[],
      rules?: Rule[]
    ): {
      t: string | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional(
      options?: { escape?: boolean; trim?: boolean } | Rule[],
      rules?: Rule[]
    ): {
      t?: string | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Signature to define a date or an optional date type
   */
  export interface DateType {
    (options?: { format?: string; opts?: DateTimeOptions }, rules?: Rule[]): {
      t: DateTime
      getTree(): SchemaLiteral
    }
    optional(
      options?: { format?: string; opts?: DateTimeOptions },
      rules?: Rule[]
    ): {
      t?: DateTime
      getTree(): SchemaLiteral
    }
    nullable(
      options?: { format?: string; opts?: DateTimeOptions },
      rules?: Rule[]
    ): {
      t: DateTime | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional(
      options?: { format?: string; opts?: DateTimeOptions },
      rules?: Rule[]
    ): {
      t?: DateTime | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Signature to define a boolean or optional boolean type
   */
  export interface BooleanType {
    (rules?: Rule[]): {
      t: boolean
      getTree(): SchemaLiteral
    }
    optional(rules?: Rule[]): {
      t?: boolean
      getTree(): SchemaLiteral
    }
    nullable(rules?: Rule[]): {
      t: boolean | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional(rules?: Rule[]): {
      t?: boolean | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Signature to define a number or optional number type
   */
  export interface NumberType {
    (rules?: Rule[]): {
      t: number
      getTree(): SchemaLiteral
    }
    optional(rules?: Rule[]): {
      t?: number
      getTree(): SchemaLiteral
    }
    nullable(rules?: Rule[]): {
      t: number | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional(rules?: Rule[]): {
      t?: number | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Signature to define a bigint or bigint number type
   */
  export interface BigIntType {
    (rules?: Rule[]): {
      t: bigint
      getTree(): SchemaLiteral
    }
    optional(rules?: Rule[]): {
      t?: bigint
      getTree(): SchemaLiteral
    }
    nullable(rules?: Rule[]): {
      t: bigint | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional(rules?: Rule[]): {
      t?: bigint | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Signature to define an object with members or an optional object
   * with members.
   */
  export interface ObjectType {
    (rules?: Rule[]): {
      members<T extends TypedSchema>(
        schema: T
      ): {
        t: { [P in keyof T]: T[P]['t'] }
        getTree(): SchemaObject
      }
      anyMembers(): {
        t: { [key: string]: any }
        getTree(): SchemaObject
      }
    }
    optional(rules?: Rule[]): {
      members<T extends TypedSchema>(
        schema: T
      ): {
        t?: { [P in keyof T]: T[P]['t'] }
        getTree(): SchemaObject
      }
      anyMembers(): {
        t?: { [key: string]: any }
        getTree(): SchemaObject
      }
    }
    nullable(rules?: Rule[]): {
      members<T extends TypedSchema>(
        schema: T
      ): {
        t: { [P in keyof T]: T[P]['t'] } | null
        getTree(): SchemaObject
      }
      anyMembers(): {
        t: { [key: string]: any } | null
        getTree(): SchemaObject
      }
    }
    nullableAndOptional(rules?: Rule[]): {
      members<T extends TypedSchema>(
        schema: T
      ): {
        t?: { [P in keyof T]: T[P]['t'] } | null
        getTree(): SchemaObject
      }
      anyMembers(): {
        t?: { [key: string]: any } | null
        getTree(): SchemaObject
      }
    }
  }

  /**
   * Signature to define an array with members or an optional array
   * with members or array/optional array with optional members
   */
  export interface ArrayType {
    (rules?: Rule[]): {
      members<T extends { t?: any; getTree(): SchemaLiteral | SchemaObject | SchemaArray }>(
        schema: T
      ): {
        t: T['t'][]
        getTree(): SchemaArray
      }
      anyMembers(): {
        t: any[]
        getTree(): SchemaArray
      }
    }
    optional(rules?: Rule[]): {
      members<T extends { t?: any; getTree(): SchemaLiteral | SchemaObject | SchemaArray }>(
        schema: T
      ): {
        t?: T['t'][]
        getTree(): SchemaArray
      }
      anyMembers(): {
        t?: any[]
        getTree(): SchemaArray
      }
    }
    nullable(rules?: Rule[]): {
      members<T extends { t?: any; getTree(): SchemaLiteral | SchemaObject | SchemaArray }>(
        schema: T
      ): {
        t: T['t'][] | null
        getTree(): SchemaArray
      }
      anyMembers(): {
        t: any[] | null
        getTree(): SchemaArray
      }
    }
    nullableAndOptional(rules?: Rule[]): {
      members<T extends { t?: any; getTree(): SchemaLiteral | SchemaObject | SchemaArray }>(
        schema: T
      ): {
        t?: T['t'][] | null
        getTree(): SchemaArray
      }
      anyMembers(): {
        t?: any[] | null
        getTree(): SchemaArray
      }
    }
  }

  /**
   * Options accepted by the enum type
   */
  export type AllowedEnumOptions = SchemaRef<unknown> | readonly unknown[]

  /**
   * Conditionally finds the return value for the Enum options
   */
  export type EnumReturnValue<Options extends AllowedEnumOptions> = Options extends SchemaRef<
    infer R
  >
    ? R extends readonly unknown[]
      ? R[number]
      : unknown
    : Options extends readonly unknown[]
    ? Options[number]
    : never

  /**
   * Conditionally finds the return value for the EnumSet options
   */
  export type EnumSetReturnValue<Options extends AllowedEnumOptions> = Options extends SchemaRef<
    infer R
  >
    ? R extends readonly unknown[]
      ? R[number][]
      : unknown
    : Options extends readonly unknown[]
    ? Options[number][]
    : never

  /**
   * Signature to define an enum type. We accept a static list of enum
   * values or a ref that is resolved lazily.
   */
  export interface EnumType {
    <Options extends AllowedEnumOptions>(options: Options, rules?: Rule[]): {
      t: EnumReturnValue<Options>
      getTree(): SchemaLiteral
    }
    optional<Options extends AllowedEnumOptions>(
      options: Options,
      rules?: Rule[]
    ): {
      t?: EnumReturnValue<Options>
      getTree(): SchemaLiteral
    }
    nullable<Options extends AllowedEnumOptions>(
      options: Options,
      rules?: Rule[]
    ): {
      t: EnumReturnValue<Options> | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional<Options extends AllowedEnumOptions>(
      options: Options,
      rules?: Rule[]
    ): {
      t?: EnumReturnValue<Options> | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Signature to define an enum set type
   */
  export interface EnumSetType {
    <Options extends AllowedEnumOptions>(options: Options, rules?: Rule[]): {
      t: EnumSetReturnValue<Options>
      getTree(): SchemaLiteral
    }
    optional<Options extends AllowedEnumOptions>(
      options: Options,
      rules?: Rule[]
    ): {
      t?: EnumSetReturnValue<Options>
      getTree(): SchemaLiteral
    }
    nullable<Options extends AllowedEnumOptions>(
      options: Options,
      rules?: Rule[]
    ): {
      t: EnumSetReturnValue<Options> | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional<Options extends AllowedEnumOptions>(
      options: Options,
      rules?: Rule[]
    ): {
      t?: EnumSetReturnValue<Options> | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Type for validating multipart files
   */
  export interface FileType {
    (options?: Partial<FileValidationOptions>, rules?: Rule[]): {
      t: MultipartFileContract
      getTree(): SchemaLiteral
    }
    optional(
      options?: Partial<FileValidationOptions>,
      rules?: Rule[]
    ): {
      t?: MultipartFileContract
      getTree(): SchemaLiteral
    }
    nullable(
      options?: Partial<FileValidationOptions>,
      rules?: Rule[]
    ): {
      t: MultipartFileContract | null
      getTree(): SchemaLiteral
    }
    nullableAndOptional(
      options?: Partial<FileValidationOptions>,
      rules?: Rule[]
    ): {
      t?: MultipartFileContract | null
      getTree(): SchemaLiteral
    }
  }

  /**
   * Shape of `schema.create` output
   */
  export type ParsedTypedSchema<T extends TypedSchema> = {
    props: {
      [P in keyof T]: T[P]['t']
    }
    tree: ParsedSchemaTree
  }

  /**
   * List of schema methods available to define a schema
   */
  export interface Schema {
    string: StringType
    boolean: BooleanType
    number: NumberType
    bigint: BigIntType
    date: DateType
    enum: EnumType
    enumSet: EnumSetType
    object: ObjectType
    array: ArrayType
    file: FileType
    refs: <T extends Object>(refs: T) => { [K in keyof T]: SchemaRef<T[K]> }
    create<T extends TypedSchema>(schema: T): ParsedTypedSchema<T>
  }

  /**
   * Shape of validator config.
   */
  export type ValidatorConfig = {
    bail?: boolean
    existsStrict?: boolean
    reporter?: () =>
      | Promise<ErrorReporterConstructorContract>
      | Promise<{ default: ErrorReporterConstructorContract }>
  }

  /**
   * Method to use content negotiation to define a custom per http request
   * repoter
   */
  export type RequestNegotiator = (request: RequestContract) => ErrorReporterConstructorContract

  /**
   * A callback method to return default messages for validation.
   */
  export type DefaultMessagesCallback = (ctx?: HttpContextContract) => CustomMessages

  /**
   * Resolved config passed to the configure method and use internally
   */
  export type ValidatorResolvedConfig = {
    bail?: boolean
    existsStrict?: boolean
    reporter?: ErrorReporterConstructorContract
    messages?: DefaultMessagesCallback
    negotiator: RequestNegotiator
  }

  /**
   * The validator node object accepted by the validated
   * method
   */
  export type ValidatorNode<T extends ParsedTypedSchema<TypedSchema>> = {
    schema: T
    data: any
    refs?: { [key: string]: SchemaRef<unknown> }
    cacheKey?: string
    messages?: CustomMessages
    existsStrict?: boolean
    reporter?: ErrorReporterConstructorContract
    bail?: boolean
  }

  /**
   * Shape of validator accepted by the request.validate function. It can be
   * a class with constructor that accepts the Context or a plain object
   * with properties accepted by the `validator.validate` method.
   */
  export type RequestValidatorNode<T extends ParsedTypedSchema<TypedSchema>> =
    | (new (ctx: HttpContextContract) => WithOptional<ValidatorNode<T>, 'data'>)
    | WithOptional<ValidatorNode<T>, 'data'>

  /**
   * Shape of the function that validates the compiler output
   */
  export type ValidateFn = <T extends ParsedTypedSchema<TypedSchema>>(
    validator: ValidatorNode<T>
  ) => Promise<T['props']>

  /**
   * Email validation and sanitization options
   */
  export type EmailRuleOptions = EmailValidationOptions & {
    /**
     * @deprecated
     */
    sanitize?:
      | boolean
      | {
          lowerCase?: boolean
          removeDots?: boolean
          removeSubaddress?: boolean
        }
  }

  /**
   * Options to validate email
   */
  export type EmailValidationOptions = {
    allowDisplayName?: boolean
    requireDisplayName?: boolean
    allowUtf8LocalPart?: boolean
    requireTld?: boolean
    ignoreMaxLength?: boolean
    allowIpDomain?: boolean
    domainSpecificValidation?: boolean
    hostBlacklist?: string[]
  }

  /**
   * Options accepted by the normalizeEmail
   * rule
   */
  export type EmailNormalizationOptions = {
    allLowercase?: boolean
    gmailLowercase?: boolean
    gmailRemoveDots?: boolean
    gmailRemoveSubaddress?: boolean
    gmailConvertGooglemaildotcom?: boolean
    outlookdotcomLowercase?: boolean
    outlookdotcomRemoveSubaddress?: boolean
    yahooLowercase?: boolean
    yahooRemoveSubaddress?: boolean
    icloudLowercase?: boolean
    icloudRemoveSubaddress?: boolean
  }

  /**
   * URL validation options
   */
  export type UrlValidationOptions = {
    protocols?: ('http' | 'https' | 'ftp')[]
    requireTld?: boolean
    requireProtocol?: boolean
    requireHost?: boolean
    allowedHosts?: string[]
    bannedHosts?: string[]
    validateLength?: boolean
  }

  /**
   * Extended options with deprecated properties
   */
  export type UrlOptions = UrlValidationOptions & {
    ensureProtocol?: string | boolean
    stripWWW?: boolean
  }

  /**
   * URL normalization options
   */
  export type UrlNormalizationOptions = {
    -readonly [K in keyof NormalizeUrlOptions]: NormalizeUrlOptions[K]
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
    required(): Rule

    /**
     * Field under validation can be nullable, but not undefined
     * or an empty string
     */
    nullable(): Rule

    /**
     * Field under validation must always exists if the
     * target field exists
     */
    requiredIfExists(field: string): Rule

    /**
     * Field under validation must always exists, if all of the
     * target field exists
     */
    requiredIfExistsAll(field: string[]): Rule

    /**
     * Field under validation must always exists, if any of the
     * target fields exists
     */
    requiredIfExistsAny(field: string[]): Rule

    /**
     * Field under validation must always exists, if target field
     * does not exists
     */
    requiredIfNotExists(field: string): Rule

    /**
     * Field under validation must always exists, if all of the
     * target fields does not exists
     */
    requiredIfNotExistsAll(field: string[]): Rule

    /**
     * Field under validation must always exists, if any of the
     * target fields does not exists
     */
    requiredIfNotExistsAny(field: string[]): Rule

    /**
     * Field under validation must always exists, when the defined
     * expecations are met
     */
    requiredWhen(
      field: string,
      operator: 'in' | 'notIn',
      comparisonValues: any[] | SchemaRef<any[]>
    ): Rule
    requiredWhen(
      field: string,
      operator: '>' | '<' | '>=' | '<=',
      comparisonValue: number | SchemaRef<number>
    ): Rule
    requiredWhen(
      field: string,
      operator: 'in' | 'notIn' | '=' | '!=' | '>' | '<' | '>=' | '<=',
      comparisonValues: any | SchemaRef<any>
    ): Rule

    /**
     * Number must be unsigned
     */
    unsigned(): Rule

    /**
     * Number must be in a specific range of values
     */
    range(start: number, stop: number): Rule

    /**
     * String must be alpha
     */
    alpha(options?: { allow?: ('space' | 'underscore' | 'dash')[] }): Rule

    /**
     * String must be alphaNum
     */
    alphaNum(options?: { allow?: ('space' | 'underscore' | 'dash')[] }): Rule

    /**
     * String must match regex
     */
    regex(regexPattern: RegExp): Rule

    /**
     * Validate string value to be formatted as an email
     * address
     */
    email(options?: EmailValidationOptions): Rule

    /**
     * Value must be a valid email address
     * @deprecated
     */
    email(options?: EmailRuleOptions): Rule

    /**
     * Normalize email address
     */
    normalizeEmail(options: EmailNormalizationOptions): Rule

    /**
     * Value must be a valid url
     */
    url(options?: UrlValidationOptions): Rule

    /**
     * Value must be a valid url
     * @deprecated
     */
    url(options?: UrlOptions): Rule

    /**
     * Normalize URL
     */
    normalizeUrl(options?: NormalizeUrlOptions): Rule

    /**
     * Trim string value
     */
    trim(): Rule

    /**
     * Escape string value
     */
    escape(): Rule

    /**
     * Value must be valid as ip address regex. Optionally you can
     * define a ipv version
     */
    ip(options?: { version?: '4' | 4 | 6 | '6' }): Rule

    /**
     * Value must be valid as per uuid format. Optionally you can
     * define a uuid version
     */
    uuid(options?: { version?: UUIDVersion }): Rule

    /**
     * Value must pass the mobile regex rule
     */
    mobile(options?: { strict?: boolean; locale?: validatorJs.MobilePhoneLocale[] }): Rule

    /**
     * Length of string or array must be below or same as the defined length
     */
    maxLength(length: number): Rule

    /**
     * Length of string or array must be above the defined length
     */
    minLength(length: number): Rule

    /**
     * Confirm field to be exists and have the same value
     */
    confirmed(field?: string): Rule

    /**
     * The value of field must be distinct inside the array
     */
    distinct(field: string): Rule

    /**
     * The value of date must be after a given duration
     */
    after(duration: number, unit: DurationUnits): Rule

    /**
     * The value of date must be after a given date
     */
    after(date: SchemaRef<DateTime>): Rule

    /**
     * The value of date must be after the given keyword.
     *
     * After "today" is equivalent to 0, days
     * After "tomorrow" is equivalent to 1, day
     */
    after(keyword: 'today' | 'tomorrow'): Rule

    /**
     * The value of date must be before a given duration
     */
    before(duration: number, unit: DurationUnits): Rule

    /**
     * The value of date must be before a given date
     */
    before(date: SchemaRef<DateTime>): Rule

    /**
     * The value of date must be before the given keyword.
     *
     * Before "today" is equivalent to 0, days
     * Before "yesterday" is equivalent to 1, day
     */
    before(keyword: 'today' | 'yesterday'): Rule

    /**
     * The value of date must be after a given date
     */
    afterField(field: string): Rule

    /**
     * The value of date must be after or equal to a given date
     */
    afterOrEqualToField(field: string): Rule

    /**
     * The value of date must be before a given date
     */
    beforeField(field: string): Rule

    /**
     * The value of date must be before or equal to a given date
     */
    beforeOrEqualToField(field: string): Rule

    /**
     * Ensure value is not in the defined array
     */
    notIn(keywords: (number | string)[] | SchemaRef<(number | string)[]>): Rule

    /**
     * The value of string must be equalToValue
     */
    equalTo(equalToValue: string | SchemaRef<string>): Rule

    /**
     * The value of date must be after or equal to a given duration
     */
    afterOrEqual(duration: number, unit: DurationUnits): Rule

    /**
     * The value of date must be after or equal to a given date
     */
    afterOrEqual(date: SchemaRef<DateTime>): Rule

    /**
     * The value of date must be after or equal to the given keyword.
     *
     * After "today" is equivalent to 0, days
     * After "tomorrow" is equivalent to 1, day
     */
    afterOrEqual(keyword: 'today' | 'tomorrow'): Rule

    /**
     * The value of date must be before or equal to a given duration
     */
    beforeOrEqual(duration: number, unit: DurationUnits): Rule

    /**
     * The value of date must be before or equal to a given date
     */
    beforeOrEqual(date: SchemaRef<DateTime>): Rule

    /**
     * The value of date must be before or equal to the given keyword.
     *
     * Before "today" is equivalent to 0, days
     * Before "yesterday" is equivalent to 1, day
     */
    beforeOrEqual(keyword: 'today' | 'yesterday'): Rule
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
    config: ValidatorResolvedConfig

    /**
     * Validate is a shorthand to compile + exec. If cache
     * key is defined, then it will also cache the
     * schemas.
     */
    validate: ValidateFn

    /**
     * Add a new validation rule
     */
    addRule(name: string, ruleDefinition: ValidationContract<any>): void

    /**
     * Add a new validation rule
     */
    rule<Options extends any>(
      name: string,
      validateFn: ValidationContract<Options>['validate'],
      compileFn?: (
        options: any[],
        type: NodeType,
        subtype: NodeSubType
      ) => Partial<ParsedRule<Options>>,
      restrictForTypes?: NodeSubType[]
    ): void

    /**
     * Type definition is set to any, since one can pass in a function or
     * an object that has chainable API. So there is no simple way
     * to guard the type definition. However, the `schema.create`
     * method will fail if the final outcome doesn't have `getTree`
     * method on it.
     */
    addType(name: string, typeDefinition: any): void

    /**
     * Type definition is set to any, since one can pass in a function or
     * an object that has chainable API. So there is no simple way
     * to guard the type definition. However, the `schema.create`
     * method will fail if the final outcome doesn't have `getTree`
     * method on it.
     */
    type(name: string, typeDefinition: any): void

    /**
     * Helpers required by the custom rules
     */
    helpers: {
      getFieldValue: (field: string, root: any, tip: any) => any
      resolveAbsoluteName: (field: string, otherField: string) => string
      exists: (value: any) => boolean
      isRef(value: any): value is SchemaRef<unknown>
      existsStrict: (value: any) => boolean
    }

    /**
     * Register a callback to return default messages.
     */
    messages: (callback: DefaultMessagesCallback) => void

    /**
     * Define a custom content negotiator
     */
    negotiator: (callback: RequestNegotiator) => void

    /**
     * List of bundled reporters
     */
    reporters: {
      api: ErrorReporterConstructorContract<{ errors: ApiErrorNode[] }>
      jsonapi: ErrorReporterConstructorContract<{ errors: JsonApiErrorNode[] }>
      vanilla: ErrorReporterConstructorContract<VanillaErrorNode>
    }

    /**
     * Configure validator global configuration
     */
    configure(config: Omit<ValidatorResolvedConfig, 'negotiator'>): void
  }

  export interface ValidationExceptionContract {
    new (flashToSession: boolean, messages?: any): {
      handle(error: InstanceType<ValidationExceptionContract>, ctx: HttpContextContract): any
    }
  }

  const ValidationException: ValidationExceptionContract
  export { schema, rules, validator, ValidationException }
}

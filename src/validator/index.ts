/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Cache from 'tmp-cache'

import {
  NodeType,
  ParsedRule,
  TypedSchema,
  NodeSubType,
  ValidatorNode,
  CompilerOutput,
  CustomMessages,
  ValidateFn,
  SchemaRef,
  ApiErrorNode,
  JsonApiErrorNode,
  VanillaErrorNode,
  RequestNegotiator,
  ParsedTypedSchema,
  ValidationContract,
  ValidatorResolvedConfig,
  ErrorReporterConstructorContract,
  DefaultMessagesCallback,
} from '../types.js'

import { schema } from '../schema/index.js'
import { Compiler } from '../compiler/index.js'
import { rules, getRuleFn } from '../rules/index.js'
import { MessagesBag } from '../messages_bag/index.js'
import validations from '../validations/index.js'

import {
  exists,
  isRef,
  isObject,
  wrapCompile,
  existsStrict,
  getFieldValue,
  getRequestReporter,
  resolveAbsoluteName,
} from './helpers.js'

import {
  VanillaErrorReporter,
  ApiErrorReporter,
  JsonApiErrorReporter,
} from '../error_reporter/index.js'

/**
 * The compiled output runtime helpers
 */
const HELPERS = { exists: exists, isObject }

/**
 * Helpers that has strict checking for non-existing values
 */
const STRICT_HELPERS = { exists: existsStrict, isObject }

/**
 * Cache to store the compiled schemas
 */
const COMPILED_CACHE = new Cache<string, CompilerOutput<any>>(100)

/**
 * An object of messages to use as fallback, when no custom
 * messages are defined.
 */
const NOOP_MESSAGES = {}

/**
 * An object of refs to use as fallback, when no custom
 * refs are defined.
 */
const NOOP_REFS = {}

/**
 * Default messages
 */
let DEFAULT_MESSAGES: CustomMessages

/**
 * Global options for the validator
 */
const OPTIONS: ValidatorResolvedConfig = {
  bail: false,
  existsStrict: false,
  reporter: VanillaErrorReporter,
  negotiator: getRequestReporter,
}

/**
 * Performs validation on the validator node
 */
const validate = <T extends ParsedTypedSchema<TypedSchema>>(
  validator: ValidatorNode<T>
): Promise<T['props']> => {
  /**
   * The reporter to use. Defaults to the [[VanillaErrorReporter]]
   */
  let Reporter: ErrorReporterConstructorContract = validator.reporter || OPTIONS.reporter!

  /**
   * Whether or not fail on the first error message
   */
  const bail = validator.bail !== undefined ? validator.bail : OPTIONS.bail!

  /**
   * Merge default messages with the validator messages
   */
  let messages = validator.messages || NOOP_MESSAGES
  if (DEFAULT_MESSAGES) {
    messages = { ...DEFAULT_MESSAGES, ...messages }
  }

  /**
   * Reporter instance
   */
  const reporter = new Reporter(new MessagesBag(messages), bail)

  /**
   * The helpers to use
   */
  const helpers =
    (validator.existsStrict !== undefined ? validator.existsStrict : OPTIONS.existsStrict!) === true
      ? STRICT_HELPERS
      : HELPERS

  /**
   * Compile everytime, when no cache is defined
   */
  if (!validator.cacheKey) {
    return new Compiler(validator.schema.tree).compile()(
      validator.data,
      validations,
      reporter,
      helpers,
      validator.refs || NOOP_REFS
    ) as Promise<T['props']>
  }

  /**
   * Look for compiled function or compile one
   */
  let compiledFn = COMPILED_CACHE.get(validator.cacheKey)
  if (!compiledFn) {
    compiledFn = new Compiler(validator.schema.tree).compile()
    COMPILED_CACHE.set(validator.cacheKey, compiledFn)
  }

  /**
   * Execute compiled function
   */
  return compiledFn(validator.data, validations, reporter, helpers, validator.refs || NOOP_REFS)
}

/**
 * Extend validator by adding a new rule
 */
const addRule = (name: string, ruleDefinition: ValidationContract<any>) => {
  process.emitWarning(
    'DeprecationWarning',
    '"validator.addRule" has been depreciated. Use "validate.rule" instead'
  )
  ;(rules as any)[name] = getRuleFn(name)
  ;(validations as any)[name] = ruleDefinition
}

/**
 * Add a new type
 */
const addType = (name: string, typeDefinition: any) => {
  process.emitWarning(
    'DeprecationWarning',
    '"validator.addType" has been depreciated. Use "validate.type" instead'
  )
  type(name, typeDefinition)
}

/**
 * Add a new type
 */
const type = (name: string, typeDefinition: any) => {
  ;(schema as any)[name] = typeDefinition
}

/**
 * Define a custom validation rule. This method must be used
 * over `addRule`
 */
const rule = (
  name: string,
  validateFn: ValidationContract<any>['validate'],
  compileFn?: (
    options: any[],
    nodeType: NodeType,
    subtype: NodeSubType
  ) => Partial<ParsedRule<any>>,
  restrictForTypes?: NodeSubType[]
) => {
  /**
   * Adding to the rules object, so that one can reference the method. Also
   * interface of rules list has to be extended seperately.
   */
  ;(rules as any)[name] = getRuleFn(name)
  ;(validations as any)[name] = {
    compile: wrapCompile(name, restrictForTypes, compileFn),
    validate: validateFn,
  }
}

/**
 * Module available methods/properties
 */
export const validator: {
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
} = {
  addRule,
  addType,
  validate,
  rule,
  type,
  helpers: {
    exists,
    isRef,
    existsStrict,
    getFieldValue,
    resolveAbsoluteName,
  },
  messages: (callback: DefaultMessagesCallback) => {
    DEFAULT_MESSAGES = callback()
    OPTIONS.messages = callback
  },
  config: OPTIONS,
  configure: (config: Omit<ValidatorResolvedConfig, 'negotiator'>) => {
    DEFAULT_MESSAGES = {}
    Object.assign(OPTIONS, config)
  },
  negotiator: (callback: RequestNegotiator) => {
    OPTIONS.negotiator = callback
  },
  reporters: {
    api: ApiErrorReporter,
    jsonapi: JsonApiErrorReporter,
    vanilla: VanillaErrorReporter,
  },
}

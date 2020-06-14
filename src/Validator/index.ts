/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import {
  NodeType,
  ParsedRule,
  TypedSchema,
  NodeSubType,
  ValidatorNode,
  CompilerOutput,
  ParsedTypedSchema,
  ValidationContract,
  validator as validatorStatic,
  ErrorReporterConstructorContract,
} from '@ioc:Adonis/Core/Validator'

import { schema } from '../Schema'
import { Compiler } from '../Compiler'
import { rules, getRuleFn } from '../Rules'
import { MessagesBag } from '../MessagesBag'
import * as validations from '../Validations'
import { exists, existsStrict, isObject, wrapCompile, getFieldValue, isRef } from './helpers'
import { VanillaErrorReporter, ApiErrorReporter, JsonApiErrorReporter } from '../ErrorReporter'

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
const COMPILED_CACHE: { [key: string]: CompilerOutput<any> } = {}

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
 * Performs validation on the validator node
 */
const validate = <T extends ParsedTypedSchema<TypedSchema>>(
  validator: ValidatorNode<T>
): Promise<T['props']> => {
  /**
   * The reporter to use. Defaults to the [[VanillaErrorReporter]]
   */
  let Reporter: ErrorReporterConstructorContract = validator.reporter || VanillaErrorReporter

  /**
   * Whether or not fail on the first error message
   */
  const bail = validator.bail === undefined ? false : validator.bail

  /**
   * Reporter instance
   */
  const reporter = new Reporter(new MessagesBag(validator.messages || NOOP_MESSAGES), bail)

  /**
   * The helpers to use
   */
  const helpers = validator.existsStrict === true ? STRICT_HELPERS : HELPERS

  /**
   * Compile everytime, when no cache is defined
   */
  if (!validator.cacheKey) {
    return new Compiler(validator.schema.tree).compile()(
      validator.data,
      validations,
      reporter,
      helpers,
      validator.refs || NOOP_REFS,
    ) as Promise<T['props']>
  }

  /**
   * Look for compiled function or compile one
   */
  let compiledFn = COMPILED_CACHE[validator.cacheKey]
  if (!compiledFn) {
    compiledFn = new Compiler(validator.schema.tree).compile()
    COMPILED_CACHE[validator.cacheKey] = compiledFn
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
    '"validator.addRule" has been depreciated. Use "validate.rule" instead',
  )

  rules[name] = getRuleFn(name)
  validations[name] = ruleDefinition
}

/**
 * Add a new type
 */
const addType = (name: string, typeDefinition: any) => {
  process.emitWarning(
    'DeprecationWarning',
    '"validator.addType" has been depreciated. Use "validate.type" instead',
  )
  type(name, typeDefinition)
}

/**
 * Add a new type
 */
const type = (name: string, typeDefinition: any) => {
  schema[name] = typeDefinition
}

/**
 * Define a custom validation rule. This method must be used
 * over `addRule`
 */
const rule = (
  name: string,
  validateFn: ValidationContract<any>['validate'],
  compileFn?: (options: any[], type: NodeType, subtype: NodeSubType) => Partial<ParsedRule<any>>,
  restrictForTypes?: NodeSubType[],
) => {
  /**
   * Adding to the rules object, so that one can reference the method. Also
   * interface of rules list has to be extended seperately.
   */
  rules[name] = getRuleFn(name)
  validations[name] = {
    compile: wrapCompile(name, restrictForTypes, compileFn),
    validate: validateFn,
  }
}

/**
 * Module available methods/properties
 */
export const validator: typeof validatorStatic = {
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
  },
  reporters: {
    api: ApiErrorReporter,
    jsonapi: JsonApiErrorReporter,
    vanilla: VanillaErrorReporter,
  },
}

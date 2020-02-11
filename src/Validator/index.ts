/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import {
  Rule,
  ExecFn,
  CompileFn,
  ValidateFn,
  ValidationContract,
  ErrorReporterConstructorContract,
} from '@ioc:Adonis/Core/Validator'

import { rules } from '../Rules'
import { schema } from '../Schema'
import { Compiler } from '../Compiler'
import { existy, isObject } from './helpers'
import * as validations from '../Validations'
import { VanillaErrorReporter } from '../ErrorReporter'

/**
 * The compiled output runtime helpers
 */
const HELPERS = { exists: existy, isObject }

/**
 * Cache to store the compiled schemas
 */
const COMPILED_CACHE = {}

/**
 * An object of messages to use as fallback, when no custom
 * messages are defined.
 */
const NOOP_MESSAGES = {}

/**
 * The global config to be used by the validator
 */
// const CONFIG = {}

/**
 * Compiles the schema to an executable function
 */
const compile: CompileFn = (parsedSchema) => new Compiler(parsedSchema.tree).compile()

/**
 * Execute the compiled schema function with runtime data and custom messages.
 * We allow custom messages and error reporter per call, so that you don't
 * have to re-compile the schema when trying to use different set of
 * validation messages.
 */
const exec: ExecFn = (compiledFn, data, messages, options) => {
  let Reporter: ErrorReporterConstructorContract = VanillaErrorReporter
  let bail = false

  if (options) {
    if (options.reporter) {
      Reporter = options.reporter
    }
    if (options.bail !== undefined) {
      bail = options.bail
    }
  }

  return compiledFn(
    data,
    validations,
    new Reporter(messages || NOOP_MESSAGES, bail),
    HELPERS,
  )
}

/**
 * Validate data using pre-parsed schema. The schema will be compiled and
 * cached using the cache key (if defined).
 */
const validate: ValidateFn = (parsedSchema, data, messages, options) => {
  if (!options || !options.cacheKey) {
    return exec(compile(parsedSchema), data, messages, options)
  }

  let compiledFn = COMPILED_CACHE[options.cacheKey]
  if (!compiledFn) {
    compiledFn = compile(parsedSchema)
    COMPILED_CACHE[options.cacheKey] = compiledFn
  }
  return exec(compiledFn, data, messages, options)
}

/**
 * Extend validator by adding a new rule
 */
const addRule = function (name: string, ruleDefinition: ValidationContract) {
  /**
   * Adding to the rules object, so that one can reference the method. Also
   * interface of rules list has to be extended seperately.
   */
  rules[name] = function rule (options?: any): Rule {
    return { name, options }
  }
  validations[name] = ruleDefinition
}

/**
 * Add a new type
 */
const addType = function (name: string, typeDefinition: any) {
  schema[name] = typeDefinition
}

/**
 * Module available methods/properties
 */
export const validator = {
  compile,
  exec,
  validate,
  rules,
  addRule,
  addType,
}

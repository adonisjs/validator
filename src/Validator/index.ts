/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import {
  CompileFn,
  ValidateFn,
  CompileAndCache,
  ValidationContract,
  ErrorReporterConstructorContract,
} from '@ioc:Adonis/Core/Validator'
import { LoggerContract } from '@ioc:Adonis/Core/Logger'

import { schema } from '../Schema'
import { Compiler } from '../Compiler'
import { rules, getRuleFn } from '../Rules'
import * as validations from '../Validations'
import { VanillaErrorReporter } from '../ErrorReporter'
import { exists, existsStrict, isObject } from './helpers'

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
const COMPILED_CACHE = {}

/**
 * An object of messages to use as fallback, when no custom
 * messages are defined.
 */
const NOOP_MESSAGES = {}

/**
 * Configuration options. They can be set using the configure
 * method
 */
let CONFIGURATION_OPTIONS: {
  logger?: LoggerContract,
} = {}

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
const validate: ValidateFn = (options) => {
  let Reporter: ErrorReporterConstructorContract = options.reporter || VanillaErrorReporter
  const bail = options.bail === undefined ? false : options.bail

  return options.schema(
    options.data,
    validations,
    new Reporter(options.messages || NOOP_MESSAGES, bail),
    options.existsStrict === true ? STRICT_HELPERS : HELPERS,
  )
}

/**
 * Compile and cache the schema using the cache key
 */
const compileAndCache: CompileAndCache = (parsedSchema, cacheKey) => {
  let compiledFn = COMPILED_CACHE[cacheKey]
  if (!compiledFn) {
    /**
     * Log when logger is defined
     */
    if (CONFIGURATION_OPTIONS.logger) {
      CONFIGURATION_OPTIONS.logger.trace(`Compiling schema for "${cacheKey}" cache key`)
    }

    compiledFn = compile(parsedSchema)
    COMPILED_CACHE[cacheKey] = compiledFn
  }

  return compiledFn
}

/**
 * Extend validator by adding a new rule
 */
const addRule = function (name: string, ruleDefinition: ValidationContract<any>) {
  /**
   * Adding to the rules object, so that one can reference the method. Also
   * interface of rules list has to be extended seperately.
   */
  rules[name] = getRuleFn(name)
  validations[name] = ruleDefinition
}

/**
 * Add a new type
 */
const addType = function (name: string, typeDefinition: any) {
  schema[name] = typeDefinition
}

/**
 * Configure validator. This method is not exposed via typings as of
 * now, since we trying to keep it public until we have enought
 * configuration options
 */
const configure = function configure (options: typeof CONFIGURATION_OPTIONS) {
  CONFIGURATION_OPTIONS = options
}

/**
 * Module available methods/properties
 */
export const validator = {
  rules,
  compile,
  addRule,
  addType,
  validate,
  compileAndCache,
  configure,
}

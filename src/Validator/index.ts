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

import { schema } from '../Schema'
import { Compiler } from '../Compiler'
import { rules, getRuleFn } from '../Rules'
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
 * Compiles the schema to an executable function
 */
const compile: CompileFn = (parsedSchema) => new Compiler(parsedSchema.tree).compile()

/**
 * Execute the compiled schema function with runtime data and custom messages.
 * We allow custom messages and error reporter per call, so that you don't
 * have to re-compile the schema when trying to use different set of
 * validation messages.
 */
const validate: ValidateFn = ({ schema: compileSchema, data, messages, reporter, bail }) => {
  let Reporter: ErrorReporterConstructorContract = reporter || VanillaErrorReporter
  bail = bail === undefined ? false : bail

  return compileSchema(
    data,
    validations,
    new Reporter(messages || NOOP_MESSAGES, bail),
    HELPERS,
  )
}

/**
 * Compile and cache the schema using the cache key
 */
const compileAndCache: CompileAndCache = (parsedSchema, cacheKey) => {
  let compiledFn = COMPILED_CACHE[cacheKey]
  if (!compiledFn) {
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
 * Module available methods/properties
 */
export const validator = {
  rules,
  compile,
  addRule,
  addType,
  validate,
  compileAndCache,
}

/*
|--------------------------------------------------------------------------
| Benchmarking AdonisJs Validator
|--------------------------------------------------------------------------
|
| The following benchmark tests AdonisJS against community popular validators.
|
| The benchmark focuses on validating a flat object of properties but with
| extra properties.
|
*/

import Joi from 'joi'
import { z } from 'zod'
import { Suite } from 'benchmark'

import { Compiler } from '../src/compiler/index.js'
import { schema } from '../src/schema/index.js'
import { validate } from './validate.js'

/**
 * Adonis pre compiled validation function
 */
const adonisValidate = new Compiler(
  schema.create({
    username: schema.string(),
    name: schema.string(),
  }).tree
).compile()

/**
 * Joi pre compile validation function
 */
const joiValidate = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
})

/**
 * Zod schema. I don't think they allow caching schema
 */
const zodSchema = z.object({
  username: z.string(),
  name: z.string(),
})

type Deferred = { resolve(): any }

/**
 * Starting benchmark
 */
new Suite()
  .add('AdonisJS', {
    defer: true,
    fn(deferred: Deferred) {
      validate(adonisValidate, {
        username: 'virk',
        name: 'Virk',
        prop1: 'foo',
      }).then(() => deferred.resolve())
    },
  })
  .add('Zod', {
    defer: true,
    fn(deferred: Deferred) {
      zodSchema
        .parseAsync({ username: 'virk', name: 'Virk', prop1: 'foo' })
        .then(() => deferred.resolve())
    },
  })
  .add('Joi', {
    defer: true,
    fn(deferred: Deferred) {
      joiValidate
        .validateAsync(
          {
            username: 'virk',
            name: 'Virk',
            prop1: 'foo',
          },
          {
            stripUnknown: true,
            allowUnknown: true,
          }
        )
        .then(() => deferred.resolve())
    },
  })
  .on('cycle', function cycle(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: Suite) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })

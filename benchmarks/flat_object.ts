/*
|--------------------------------------------------------------------------
| Benchmarking AdonisJs Validator
|--------------------------------------------------------------------------
|
| The following benchmark tests AdonisJS against community popular validators.
| The benchmark focuses on validating a flat object of properties.
|
*/

import Joi from 'joi'
import { z } from 'zod'
import benchmark from 'benchmark'
import { validateOrReject, IsString } from 'class-validator'

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
 * Class validator from Typescript. Sadly, they don't have any
 * pre compling option, so it's unfair to benchark it against
 * be pre compiled code. However, we still keep it, coz it
 * has first class typescript support and so does AdonisJS
 * validator.
 */
class User {
  @IsString()
  declare username: string

  @IsString()
  declare name: string
}

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
new benchmark.Suite()
  .add('AdonisJS', {
    defer: true,
    fn(deferred: Deferred) {
      validate(adonisValidate, { username: 'virk', name: 'Virk' }).then(() => deferred.resolve())
    },
  })
  .add('Zod', {
    defer: true,
    fn(deferred: Deferred) {
      zodSchema.parseAsync({ username: 'virk', name: 'Virk' }).then(() => deferred.resolve())
    },
  })
  .add('Joi', {
    defer: true,
    fn(deferred: Deferred) {
      joiValidate.validateAsync({ username: 'virk', name: 'Virk' }).then(() => deferred.resolve())
    },
  })
  .add('Class Validator', {
    defer: true,
    fn(deferred: Deferred) {
      const user = new User()
      user.name = 'Virk'
      user.username = 'virk'
      validateOrReject(user).then(() => deferred.resolve())
    },
  })
  .on('cycle', function cycle(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: benchmark.Suite) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })

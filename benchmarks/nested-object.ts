/*
|--------------------------------------------------------------------------
| Benchmarking AdonisJs Validator
|--------------------------------------------------------------------------
|
| The following benchmark tests AdonisJS against community popular validators.
| The benchmark focuses on validating a nested object.
|
*/

import Joi from 'joi'
import { z } from 'zod'
import { Suite } from 'benchmark'
import { validateOrReject, ValidateNested, IsString } from 'class-validator'
import { validateAll, schema as indicativeSchema } from 'indicative/validator'

import { Compiler } from '../src/Compiler'
import { schema } from '../src/Schema'
import { validate } from './validate'

/**
 * Adonis pre compiled validation function
 */
const adonisValidate = new Compiler(
  schema.create({
    username: schema.string(),
    name: schema.string(),
    profile: schema.object().members({
      twitterHandle: schema.string(),
    }),
  }).tree
).compile()

/**
 * Joi pre compile validation function
 */
const joiValidate = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
  profile: Joi.object({
    twitterHandle: Joi.string().required(),
  }).required(),
})

/**
 * Class validator from Typescript. Sadly, they don't have any
 * pre compling option, so it's unfair to benchark it against
 * be pre compiled code. However, we still keep it, coz it
 * has first class typescript support and so does AdonisJS
 * validator.
 */
class Profile {
  @IsString()
  public twitterHandle: string
}

class User {
  @IsString()
  public username: string

  @IsString()
  public name: string

  @ValidateNested()
  public profile: Profile
}

/**
 * Indicative schema
 */
const indicativeCompiled = indicativeSchema.new({
  username: indicativeSchema.string(),
  name: indicativeSchema.string(),
  profile: indicativeSchema.object().members({
    twitterHandle: indicativeSchema.string(),
  }),
})

/**
 * Indicative doesn't have a pre-compile function. However, validting
 * once with a cache key caches the compiled schema
 */
validateAll(
  {
    username: 'virk',
    name: 'Virk',
    profile: {
      twitterHandle: '@AmanVirk1',
    },
  },
  indicativeCompiled,
  {},
  {
    cacheKey: 'nested-object',
  }
)

/**
 * Zod schema. I don't think they allow caching schema
 */
const zodSchema = z.object({
  username: z.string(),
  name: z.string(),
  profile: z.object({
    twitterHandle: z.string(),
  }),
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
        profile: {
          twitterHandle: '@AmanVirk1',
        },
      }).then(() => deferred.resolve())
    },
  })
  .add('Zod', {
    defer: true,
    fn(deferred: Deferred) {
      zodSchema
        .parseAsync({
          username: 'virk',
          name: 'Virk',
          profile: {
            twitterHandle: '@AmanVirk1',
          },
        })
        .then(() => deferred.resolve())
    },
  })
  .add('Joi', {
    defer: true,
    fn(deferred: Deferred) {
      joiValidate
        .validateAsync({
          username: 'virk',
          name: 'Virk',
          profile: {
            twitterHandle: '@AmanVirk1',
          },
        })
        .then(() => deferred.resolve())
    },
  })
  .add('Indicative', {
    defer: true,
    fn(deferred: Deferred) {
      validateAll(
        {
          username: 'virk',
          name: 'Virk',
          profile: {
            twitterHandle: '@AmanVirk1',
          },
        },
        indicativeCompiled,
        {},
        {
          cacheKey: 'nested-object',
        }
      ).then(() => deferred.resolve())
    },
  })
  .add('Class Validator', {
    defer: true,
    fn(deferred: Deferred) {
      const user = new User()
      const profile = new Profile()
      profile.twitterHandle = '@AmanVirk1'

      user.name = 'Virk'
      user.username = 'virk'
      user.profile = profile
      validateOrReject(user).then(() => deferred.resolve())
    },
  })
  .on('cycle', function cycle(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })

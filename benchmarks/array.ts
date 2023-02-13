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

import { validate } from './validate.js'
import { schema } from '../src/schema/index.js'
import { Compiler } from '../src/compiler/index.js'

/**
 * Adonis pre compiled validation function
 */
const adonisValidate = new Compiler(
  schema.create({
    username: schema.string(),
    name: schema.string(),
    profiles: schema.array().members(
      schema.object().members({
        profileId: schema.string(),
      })
    ),
  }).tree
).compile()

/**
 * Joi pre compile validation function
 */
const joiValidate = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
  profiles: Joi.array()
    .items(
      Joi.object({
        profileId: Joi.string().required(),
      }).required()
    )
    .required(),
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
  declare profileId: string
}

class User {
  @IsString()
  declare username: string

  @IsString()
  declare name: string

  @ValidateNested()
  declare profile: Profile[]
}

/**
 * Zod schema. I don't think they allow caching schema
 */
const zodSchema = z.object({
  username: z.string(),
  name: z.string(),
  profiles: z.array(
    z.object({
      profileId: z.string(),
    })
  ),
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
        profiles: [
          {
            profileId: 'virk011',
          },
        ],
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
          profiles: [
            {
              profileId: 'virk011',
            },
          ],
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
          profiles: [
            {
              profileId: 'virk011',
            },
          ],
        })
        .then(() => deferred.resolve())
    },
  })
  .add('Class Validator', {
    defer: true,
    fn(deferred: Deferred) {
      const user = new User()
      const profile = new Profile()
      profile.profileId = 'virk011'

      user.name = 'Virk'
      user.username = 'virk'
      user.profile = [profile]
      validateOrReject(user).then(() => deferred.resolve())
    },
  })
  .on('cycle', function cycle(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function (this: Suite) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: true })

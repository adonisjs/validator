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

import Joi from '@hapi/joi'
import { Suite } from 'benchmark'
import { validateAll, schema as indicativeSchema } from 'indicative/validator'

import { validator } from '../src/Validator'
import { schema } from '../src/Schema'

/**
 * Adonis pre compiled validation function
 */
const adonisValidate = validator.compile(schema.create({
  username: schema.string(),
  name: schema.string(),
}))

/**
 * Joi pre compile validation function
 */
const joiValidate = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
})

/**
 * Indicative schema
 */
const indicativeCompiled = indicativeSchema.new({
  username: indicativeSchema.string(),
  name: indicativeSchema.string(),
})

/**
 * Indicative doesn't have a pre-compile function. However, validting
 * once with a cache key caches the compiled schema
 */
validateAll({ username: 'virk', name: 'Virk', prop1: 'foo' }, indicativeCompiled, {}, {
  cacheKey: 'foo',
})

type Deferred = { resolve (): any }

/**
 * Starting benchmark
 */
new Suite()
  .add('AdonisJS', {
    defer: true,
    fn (deferred: Deferred) {
      validator.validate(adonisValidate, {
        username: 'virk',
        name: 'Virk',
        prop1: 'foo',
      }).then(() => deferred.resolve())
    },
  })
  .add('Joi', {
    defer: true,
    fn (deferred: Deferred) {
      joiValidate.validateAsync({
        username: 'virk',
        name: 'Virk',
        prop1: 'foo',
      }, {
        stripUnknown: true,
        allowUnknown: true,
      }).then(() => deferred.resolve())
    },
  })
  .add('Indicative', {
    defer: true,
    fn (deferred: Deferred) {
      validateAll({ username: 'virk', name: 'Virk', prop1: 'foo' }, indicativeCompiled, {}, {
        cacheKey: 'foo',
      }).then(() => deferred.resolve())
    },
  })
  .on('cycle', function cycle (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ 'async': true })

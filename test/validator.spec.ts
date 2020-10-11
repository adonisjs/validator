/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { DateTime } from 'luxon'
import { validator as validatorType } from '@ioc:Adonis/Core/Validator'

import { rules } from '../src/Rules'
import { schema } from '../src/Schema'
import { getLiteralType } from '../src/utils'
import * as validations from '../src/Validations'
import { ApiErrorReporter } from '../src/ErrorReporter'
import { validator as validatorBase } from '../src/Validator'

const validator = (validatorBase as unknown) as typeof validatorType

test.group('Validator | validate', () => {
	test('validate schema object against runtime data', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					username: schema.string(),
				}),
				data: {},
			})
		} catch (error) {
			assert.deepEqual(error.messages, { username: ['required validation failed'] })
		}
	})

	test('collect all errors', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					username: schema.string(),
					email: schema.string(),
					password: schema.string(),
				}),
				data: {},
			})
		} catch (error) {
			assert.deepEqual(error.messages, {
				username: ['required validation failed'],
				email: ['required validation failed'],
				password: ['required validation failed'],
			})
		}
	})

	test('stop at first error when bail is true', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					username: schema.string(),
					email: schema.string(),
					password: schema.string(),
				}),
				data: {},
				bail: true,
			})
		} catch (error) {
			assert.deepEqual(error.messages, {
				username: ['required validation failed'],
			})
		}
	})

	test('use custom messages when defined', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					username: schema.string(),
					email: schema.string(),
					password: schema.string(),
				}),
				data: {},
				messages: {
					required: 'The field is required',
				},
				bail: true,
			})
		} catch (error) {
			assert.deepEqual(error.messages, {
				username: ['The field is required'],
			})
		}
	})

	test('use custom error reporter when defined', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					username: schema.string(),
					email: schema.string(),
					password: schema.string(),
				}),
				data: {},
				messages: { required: 'The field is required' },
				bail: true,
				reporter: ApiErrorReporter,
			})
		} catch (error) {
			assert.deepEqual(error.messages, {
				errors: [
					{
						rule: 'required',
						field: 'username',
						message: 'The field is required',
					},
				],
			})
		}
	})

	test('cache schema using the cache key', async () => {
		const initialSchema = schema.create({
			username: schema.string.optional(),
		})

		/**
		 * First validation will be skipped, since we have marked
		 * the field optional
		 */
		await validator.validate({
			schema: initialSchema,
			data: {},
			cacheKey: 'foo',
			reporter: ApiErrorReporter,
		})

		const newSchema = schema.create({
			username: schema.string(),
		})

		/**
		 * This one should have failed, but not, since the same
		 * cache key is used and hence new schema is not
		 * compiled
		 */
		await validator.validate({
			schema: newSchema,
			data: {},
			cacheKey: 'foo',
			reporter: ApiErrorReporter,
		})
	})
})

test.group('Validator | rule', () => {
	test('add a custom rule', (assert) => {
		validator.rule('isPhone', () => {})

		assert.property(validations, 'isPhone')
		assert.property(rules, 'isPhone')
		assert.deepEqual(rules['isPhone'](), { name: 'isPhone', options: [] })
		assert.deepEqual(rules['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
		assert.deepEqual(validations['isPhone'].compile('literal', 'string', []), {
			async: false,
			allowUndefineds: false,
			name: 'isPhone',
			compiledOptions: [],
		})
	})

	test('rule recieves correct arguments', async (assert) => {
		assert.plan(14)

		const name = 'testArguments'

		const refs = schema.refs({
			username: 'ruby',
		})

		const options = [
			{
				operator: '=',
			},
		]

		const data = {
			users: ['virk'],
		}

		validator.rule(
			name,
			(value, compiledOptions, runtimeOptions) => {
				assert.equal(value, 'virk')
				assert.deepEqual(compiledOptions, options)
				assert.hasAllKeys(runtimeOptions, [
					'root',
					'tip',
					'field',
					'pointer',
					'arrayExpressionPointer',
					'refs',
					'errorReporter',
					'mutate',
				])
				assert.deepEqual(runtimeOptions.root, data)
				assert.deepEqual(runtimeOptions.tip, ['virk'])
				assert.equal(runtimeOptions.field, '0')
				assert.equal(runtimeOptions.pointer, 'users.0')
				assert.equal(runtimeOptions.arrayExpressionPointer, 'users.*')
				assert.deepEqual(runtimeOptions.refs, refs)
				assert.instanceOf(runtimeOptions.errorReporter, ApiErrorReporter)
				assert.isFunction(runtimeOptions.mutate)
			},
			(opts, type, subtype) => {
				assert.deepEqual(opts, options)
				assert.equal(type, 'literal')
				assert.equal(subtype, 'string')
				return {}
			}
		)

		await validator.validate({
			refs,
			schema: schema.create({
				users: schema.array().members(schema.string({}, [{ name, options }])),
			}),
			data,
			reporter: ApiErrorReporter,
		})
	})

	test('set allowUndefineds to true', (assert) => {
		validator.rule(
			'isPhone',
			() => {},
			() => {
				return {
					allowUndefineds: true,
				}
			}
		)

		assert.property(validations, 'isPhone')
		assert.property(rules, 'isPhone')
		assert.deepEqual(rules['isPhone'](), { name: 'isPhone', options: [] })
		assert.deepEqual(rules['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
		assert.deepEqual(validations['isPhone'].compile('literal', 'string', []), {
			async: false,
			allowUndefineds: true,
			name: 'isPhone',
			compiledOptions: [],
		})
	})

	test('return custom options', (assert) => {
		validator.rule(
			'isPhone',
			() => {},
			(options) => {
				assert.isArray(options)
				return {
					compiledOptions: { foo: 'bar' },
				}
			}
		)

		assert.property(validations, 'isPhone')
		assert.property(rules, 'isPhone')
		assert.deepEqual(rules['isPhone'](), { name: 'isPhone', options: [] })
		assert.deepEqual(rules['isPhone']('sample'), { name: 'isPhone', options: ['sample'] })
		assert.deepEqual(validations['isPhone'].compile('literal', 'string', []), {
			async: false,
			allowUndefineds: false,
			name: 'isPhone',
			compiledOptions: { foo: 'bar' },
		})
	})
})

test.group('Validator | addType', () => {
	test('add a custom type', (assert) => {
		function unicorn() {
			return getLiteralType('unicorn', false, {}, [])
		}
		validator.addRule('unicorn', {
			compile() {
				return {
					async: false,
					allowUndefineds: false,
					name: 'unicorn',
					compiledOptions: undefined,
				}
			},
			validate() {},
		})
		validator.addType('unicorn', unicorn)

		assert.property(schema, 'file')
		const parsed = schema.create({
			avatar: schema['unicorn'](),
		})

		assert.deepEqual(parsed.tree, {
			avatar: {
				type: 'literal' as const,
				subtype: 'unicorn',
				rules: [
					{
						name: 'required',
						async: false,
						allowUndefineds: true,
						compiledOptions: [],
					},
					{
						name: 'unicorn',
						async: false,
						allowUndefineds: false,
						compiledOptions: undefined,
					},
				],
			},
		})
	})
})

test.group('Validator | validations with non-serialized options', () => {
	test('validate against a regex', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					username: schema.string({}, [rules.regex(/[a-z]/)]),
				}),
				data: {
					username: '12',
				},
			})
		} catch (error) {
			assert.deepEqual(error.messages, { username: ['regex validation failed'] })
		}
	})
})

test.group('Min Max Rules', () => {
	test('min rule should check against the original value', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					username: schema.string({ escape: true }, [rules.minLength(5)]),
				}),
				data: {
					username: '\\0',
				},
			})
		} catch (error) {
			assert.deepEqual(error.messages, { username: ['minLength validation failed'] })
		}
	})

	test('min rule should check against the original nested value', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					profile: schema.object().members({
						username: schema.string({ escape: true }, [rules.minLength(5)]),
					}),
				}),
				data: {
					profile: {
						username: '\\0',
					},
				},
			})
		} catch (error) {
			assert.deepEqual(error.messages, { 'profile.username': ['minLength validation failed'] })
		}
	})
})

test.group('After Before Field', () => {
	test('fail when value is not after the defined field value', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					after: schema.date({}, [rules.afterField('before')]),
					before: schema.date({}),
				}),
				data: {
					before: '2020-10-20',
					after: '2020-10-19',
				},
			})
		} catch (error) {
			assert.deepEqual(error.messages, { after: ['after date validation failed'] })
		}
	})

	test('pass when value is after the defined field value', async (assert) => {
		const { before, after } = await validator.validate({
			schema: schema.create({
				after: schema.date({}, [rules.afterField('before')]),
				before: schema.date({}),
			}),
			data: {
				before: '2020-10-20',
				after: '2020-10-22',
			},
		})

		assert.instanceOf(before, DateTime)
		assert.instanceOf(after, DateTime)
	})

	test('handle date formatting', async (assert) => {
		const { before, after } = await validator.validate({
			schema: schema.create({
				after: schema.date({ format: 'LLLL dd yyyy' }, [rules.afterField('before')]),
				before: schema.date({ format: 'LLLL dd yyyy' }),
			}),
			data: {
				before: 'October 10 2020',
				after: 'October 12 2020',
			},
		})

		assert.instanceOf(before, DateTime)
		assert.instanceOf(after, DateTime)
	})

	test('handle use case when comparison field is not valid separately', async (assert) => {
		const { after } = await validator.validate({
			schema: schema.create({
				after: schema.date({ format: 'LLLL dd yyyy' }, [rules.afterField('before')]),
			}),
			data: {
				before: 'October 10 2020',
				after: 'October 12 2020',
			},
		})

		assert.instanceOf(after, DateTime)
	})

	test('fail when format mis-match', async (assert) => {
		assert.plan(1)

		try {
			await validator.validate({
				schema: schema.create({
					after: schema.date({ format: 'LLLL dd yyyy' }, [rules.afterField('before')]),
				}),
				data: {
					after: 'October 12 2020',
					before: '2020-10-10',
				},
			})
		} catch (error) {
			assert.deepEqual(error.messages, { after: ['after date validation failed'] })
		}
	})
})

test.group('Validator | object', () => {
	test('validate object with any members', async (assert) => {
		assert.plan(1)

		const output = await validator.validate({
			schema: schema.create({
				profile: schema.object().anyMembers(),
			}),
			data: {
				profile: {
					username: 'virk',
					age: 30,
				},
			},
		})

		assert.deepEqual(output, { profile: { username: 'virk', age: 30 } })
	})

	test('validate optional object with any members', async (assert) => {
		assert.plan(1)

		const output = await validator.validate({
			schema: schema.create({
				profile: schema.object.optional().anyMembers(),
			}),
			data: {},
		})
		assert.deepEqual(output, { profile: undefined })
	})

	test('validate object with zero members', async (assert) => {
		assert.plan(1)

		const output = await validator.validate({
			schema: schema.create({
				profile: schema.object().members({}),
			}),
			data: {
				profile: {
					username: 'virk',
					age: 30,
				},
			},
		})

		assert.deepEqual(output, { profile: {} })
	})

	test('validate optional object with zero members', async (assert) => {
		assert.plan(1)

		const output = await validator.validate({
			schema: schema.create({
				profile: schema.object.optional().members({}),
			}),
			data: {},
		})

		assert.deepEqual(output, { profile: {} })
	})
})

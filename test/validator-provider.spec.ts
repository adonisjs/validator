/*
 * @adonisjs/events
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { join } from 'path'
import { Registrar, Ioc } from '@adonisjs/fold'

import { validator } from '../src/Validator'
import { schema } from '../src/Schema'
import { rules } from '../src/Rules'

test.group('Encryption Provider', () => {
	test('register encryption provider', async (assert) => {
		const ioc = new Ioc()
		const registrar = new Registrar(ioc, join(__dirname, '..'))
		await registrar.useProviders(['./providers/ValidatorProvider']).registerAndBoot()
		assert.deepEqual(ioc.use('Adonis/Core/Validator'), { validator, schema, rules })
	})

	test('extend request class by adding the validate method', async (assert) => {
		const ioc = new Ioc()
		const registrar = new Registrar(ioc, join(__dirname, '..'))
		await registrar
			.useProviders(['@adonisjs/http-server', './providers/ValidatorProvider'])
			.registerAndBoot()

		assert.property(ioc.use('Adonis/Core/Request').prototype, 'validate')
	})
})

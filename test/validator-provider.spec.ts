/*
 * @adonisjs/events
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'

import { rules } from '../src/Rules'
import { schema } from '../src/Schema'
import { validator } from '../src/Validator'
import { setupApp, fs } from '../test-helpers'

test.group('Encryption Provider', (group) => {
	group.afterEach(async () => {
		await fs.cleanup()
	})

	test('register encryption provider', async (assert) => {
		const app = await setupApp(['../../providers/ValidatorProvider'])
		assert.deepEqual(app.container.use('Adonis/Core/Validator'), { validator, schema, rules })
	})

	test('extend request class by adding the validate method', async (assert) => {
		const app = await setupApp(['../../providers/ValidatorProvider'])
		assert.property(app.container.use('Adonis/Core/Request').prototype, 'validate')
	})
})

/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'path'
import { Filesystem } from '@poppinss/dev-utils'
import { Application } from '@adonisjs/application'

export const fs = new Filesystem(join(__dirname, 'app'))

/**
 * Setup AdonisJS application
 */
export async function setupApp(
	providers?: string[],
	configReporter?: 'api' | 'vanilla' | 'jsonapi'
) {
	await fs.add('.env', '')
	await fs.add(
		'config/app.ts',
		`
		const use = global[Symbol.for('ioc.use')]

		export const appKey = 'averylongrandom32charssecret'
		export const profiler = {
			enabled: true
		}
		export const http = {
			trustProxy: () => true,
			cookie: {},
		}
		export const validator = {
			reporter: async () => use('Adonis/Core/Validator').validator.reporters['${configReporter}']
		}
	`
	)

	const app = new Application(fs.basePath, 'web', {
		providers: ['@adonisjs/encryption', '@adonisjs/http-server'].concat(providers || []),
	})

	await app.setup()
	await app.registerProviders()
	await app.bootProviders()

	return app
}

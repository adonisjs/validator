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
export async function setupApp(providers?: string[]) {
	await fs.add('.env', '')
	await fs.add(
		'config/app.ts',
		`
		export const appKey = 'averylongrandom32charssecret'
		export const profiler = {
			enabled: true
		}
		export const http = {
			trustProxy: () => true,
			cookie: {},
		}
	`
	)

	const app = new Application(fs.basePath, 'web', {
		providers: ['@adonisjs/encryption', '@adonisjs/http-server'].concat(providers || []),
	})
	app.setup()
	app.registerProviders()
	await app.bootProviders()

	return app
}

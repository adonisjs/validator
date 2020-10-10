/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Provider to register validator with the IoC container
 */
export default class ValidationProvider {
	constructor(protected app: ApplicationContract) {}

	public static needsApplication = true

	public register() {
		this.app.container.singleton('Adonis/Core/Validator', () => {
			return {
				validator: require('../src/Validator').validator,
				schema: require('../src/Schema').schema,
				rules: require('../src/Rules').rules,
			}
		})
	}

	public async boot() {
		this.app.container.with(
			['Adonis/Core/Request', 'Adonis/Core/Validator'],
			(Request, Validator) => {
				require('../src/Bindings/Request').default(Request, Validator.validator.validate)
			}
		)
	}
}

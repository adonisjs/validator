/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IocContract } from '@adonisjs/fold'
import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'
import { validator } from '../src/Validator'

/**
 * Provider to register validator with the IoC container
 */
export default class ValidationProvider {
	constructor(protected container: IocContract) {}

	public register() {
		this.container.singleton('Adonis/Core/Validator', () => {
			return {
				validator: require('../src/Validator').validator,
				schema: require('../src/Schema').schema,
				rules: require('../src/Rules').rules,
			}
		})
	}

	public async boot() {
		this.container.with(
			['Adonis/Core/Request', 'Adonis/Core/Validator'],
			(Request: RequestConstructorContract, Validator: { validator: typeof validator }) => {
				require('../src/Bindings/Request').default(Request, Validator.validator.validate)
			}
		)
	}
}

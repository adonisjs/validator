/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'
import { validator, ValidatorConfig, RequestValidatorNode } from '@ioc:Adonis/Core/Validator'
import { getRequestReporter } from '../Validator/helpers'

/**
 * Extends the request class by adding `validate` method
 * to it
 */
export default function extendRequest(
	Request: RequestConstructorContract,
	validate: typeof validator['validate'],
	config: ValidatorConfig
) {
	Request.macro('validate', async function validateRequest(Validator: RequestValidatorNode<any>) {
		/**
		 * Merging request body, files and the params. The params are nested, since
		 * it's possible that request body and params may have the same object
		 * properties.
		 */
		const validatorNode = typeof Validator === 'function' ? new Validator(this.ctx!) : Validator
		const data = validatorNode.data || {
			...this.all(),
			...this.allFiles(),
			params: this.ctx!.params,
		}

		/**
		 * Choosing the correct reporter for the given HTTP request. This is how it works
		 *
		 * - The first preference is given to the inline reporter
		 * - Next we check the existence of "config.requestReporter" function and use its return value
		 * - Otherwise use custom content negotiation.
		 */
		const reporter = validatorNode.reporter
			? validatorNode.reporter
			: config.requestReporter
			? config.requestReporter(this)
			: getRequestReporter(this)

		/**
		 * Creating a new profiler action to profile the validation
		 */
		const profilerAction = this.ctx!.profiler.profile('request:validate')

		try {
			const validated = await validate({ data, reporter, ...validatorNode })
			profilerAction.end({ status: 'success' })
			return validated
		} catch (error) {
			profilerAction.end({ status: 'error' })
			throw error
		}
	})
}

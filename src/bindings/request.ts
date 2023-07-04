/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Request } from '@adonisjs/core/http'
import '@adonisjs/core/bodyparser_middleware'

import { validator } from '../validator/index.js'
import type { TypedSchema, ParsedTypedSchema, RequestValidatorNode } from '../types.js'

declare module '@adonisjs/http-server' {
  interface Request {
    /**
     * Validate current request. The data is optional here, since request
     * can pre-fill it for us
     */
    validate<T extends ParsedTypedSchema<TypedSchema>>(
      validator: RequestValidatorNode<T>
    ): Promise<T['props']>
  }
}

Request.macro(
  'validate',
  async function validateRequest(this: Request, Validator: RequestValidatorNode<any>) {
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
     * - Otherwise use the negotiator
     */
    const reporter = validatorNode.reporter
      ? validatorNode.reporter
      : validator.config.negotiator(this)

    /**
     * Merge user defined messages with the default
     * messages
     */
    let messages = validatorNode.messages
    if (validator.config.messages) {
      messages = { ...validator.config.messages(this.ctx), ...messages }
    }

    return validator.validate({ data, reporter, ...validatorNode, messages })
  }
)

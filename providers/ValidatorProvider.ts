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

import { rules } from '../src/Rules'
import { schema } from '../src/Schema'
import { validator } from '../src/Validator'
import extendRequest from '../src/Bindings/Request'

/**
 * Provider to register validator with the IoC container
 */
export default class ValidationProvider {
  constructor (protected container: IocContract) {
  }

  public register () {
    this.container.singleton('Adonis/Core/Validator', () => {
      return {
        validator,
        schema,
        rules,
      }
    })
  }

  public boot () {
    this.container.with([
      'Adonis/Core/Request',
      'Adonis/Core/Validator',
    ], (Request: RequestConstructorContract, Validator: { validator: typeof validator }) => {
      extendRequest(Request, Validator.validator.validate)
    })
  }
}

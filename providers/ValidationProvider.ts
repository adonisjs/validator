/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { IocContract } from '@adonisjs/fold'

import { Validator } from '../src/Validator'
import extendRequest from '../src/Bindings/Request'

/**
 * Validation provider
 */
export default class ValidationProvider {
  constructor (protected $container: IocContract) {}

  /**
   * Register binding
   */
  public register (): void {
    this.$container.singleton('Adonis/Core/Validator', () => {
      const Config = this.$container.use('Adonis/Core/Config')
      return new Validator(Config.get('validator', {}))
    })
  }

  /**
   * Decorate request during boot
   */
  public boot (): void {
    this.$container.with(
      ['Adonis/Core/Validator', 'Adonis/Core/Request'],
      (validator, request) => extendRequest(request, validator.validateAll.bind(validator)),
    )
  }
}

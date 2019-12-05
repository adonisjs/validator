/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { IocContract } from '@adonisjs/fold'

export default class ValidationProvider {
  constructor (protected $container: IocContract) {}

  public register (): void {
    this.$container.singleton('Adonis/Core/Validator', () => {
      return require('../src/Validator')
    })
  }
}

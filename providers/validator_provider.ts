/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ApplicationService } from '@adonisjs/core/types'
import { validator } from '../index.js'

/**
 * ValidatorProvider is used to configure the validator using the
 * "config/validator.ts" config file.
 */
export default class ValidatorProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Configure the validator
   */
  protected async configureValidator() {
    const config = await this.app.container.make('config')
    validator.configure(config.get('validator', {}))
  }

  async boot() {
    await this.configureValidator()
  }
}

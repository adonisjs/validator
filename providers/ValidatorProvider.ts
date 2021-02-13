/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { esmResolver } from '@poppinss/utils'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

/**
 * Provider to register validator with the IoC container
 */
export default class ValidationProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true

  /**
   * Configures validator with the user defined options. We need to
   * resolve the imported reporter (when defined)
   */
  private async configureValidator() {
    const Config = this.app.container.resolveBinding('Adonis/Core/Config')
    const { validator } = this.app.container.resolveBinding('Adonis/Core/Validator')

    /**
     * Resolve reporter when defined
     */
    const validatorConfig = Object.assign({}, Config.get('app.validator'))
    if (validatorConfig.reporter) {
      validatorConfig.reporter = esmResolver(await validatorConfig.reporter())
    }

    validator.configure(validatorConfig)
    return validator
  }

  /**
   * Register validator
   */
  public register() {
    this.app.container.singleton('Adonis/Core/Validator', () => {
      const { validator } = require('../src/Validator')
      return {
        ValidationException: require('../src/ValidationException').ValidationException,
        validator: validator,
        schema: require('../src/Schema').schema,
        rules: require('../src/Rules').rules,
      }
    })
  }

  public async boot() {
    const validator = await this.configureValidator()
    this.app.container.withBindings(['Adonis/Core/Request'], (Request) => {
      require('../src/Bindings/Request').default(Request, validator.validate, validator.config)
    })
  }
}

'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')
const { Command } = require('@adonisjs/ace')

/**
 * Command to create a validator
 *
 * @class MakeValidator
 * @constructor
 */
class MakeValidator extends Command {
  constructor (Helpers) {
    super()
    this.Helpers = Helpers
  }

  /* istanbul ignore next */
  /**
   * IoC container injections
   *
   * @method inject
   *
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  /* istanbul ignore next */
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return 'make:validator {name : Name of the validator}'
  }

  /* istanbul ignore next */
  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Make route validator'
  }

  /**
   * Method called when command is executed
   *
   * @method handle
   *
   * @param  {String} options.name
   *
   * @return {void}
   */
  async handle ({ name }) {
    name = name.replace(/Validator$/i, '')

    /**
     * Reading template as a string form the mustache file
     */
    const template = await this.readFile(path.join(__dirname, './templates/validator.mustache'), 'utf8')

    /**
     * Directory paths
     */
    const relativePath = path.join('app/Validators', `${name}.js`)
    const validatorPath = path.join(this.Helpers.appRoot(), relativePath)
    const className = name.replace(/[-/_](\w)/g, (match, group) => group.toUpperCase())

    /**
     * If command is not executed via command line, then return
     * the response
     */
    if (!this.viaAce) {
      return this.generateFile(validatorPath, template, { name: className })
    }

    /* istanbul ignore next */
    /**
     * Otherwise wrap in try/catch and show appropriate messages
     * to the end user.
     */
    try {
      await this.generateFile(validatorPath, template, { name: className })
      this.completed('create', relativePath)
    } catch (error) {
      this.error(`${relativePath} validator already exists`)
    }
  }
}

module.exports = MakeValidator

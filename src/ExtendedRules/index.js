'use strict'

/**
 * adonis-validation-provider
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

class ExtendedRules {

  constructor (Database) {
    this.database = Database
  }

  unique (data, field, message, args, get) {
    return new Promise((resolve, reject) => {
      const fieldValue = get(data, field)
      if (!fieldValue) {
        return resolve('validation skipped')
      }
      const table = args[0]
      const databaseField = args[1] || field
      this.database
        .table(table)
        .select(databaseField)
        .where(databaseField, fieldValue)
        .pluck(databaseField)
        .then((result) => {
          if (result && result.length) {
            return reject(message)
          }
          resolve('validation passed')
        })
        .catch(reject)
    })
  }

}

module.exports = ExtendedRules

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

      /**
       * skip if value is empty, required validation will
       * take care of empty values
       */
      if (!fieldValue) {
        return resolve('validation skipped')
      }

      const tableName = args[0]
      const databaseField = args[1] || field
      const query = this.database.table(tableName).where(databaseField, fieldValue)

      /**
       * if args[2] and args[3] are avaiable inside the array
       * take them as whereNot key/valye pair
       */
      if (args[2] && args[3]) {
        query.whereNot(args[2], args[3])
      }

      query
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

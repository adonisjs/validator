/**
 * Config source: https://git.io/Jey3v
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { ValidatorConfigContract, formatters } from '@ioc:Adonis/Core/Validator'

const validatorConfig: ValidatorConfigContract = {
  /*
  |--------------------------------------------------------------------------
  | Existy Strict
  |--------------------------------------------------------------------------
  |
  | When `existyStrict` is set to `false`, then indicative will consider
  | following values as non-existing.
  |
  | - empty string
  | - null
  | - undefined
  |
  | However, when `existyStrict = true`, then only `undefined` values are
  | consider non-existing.
  |
  | How does it impact you?
  |
  | Optional validation rules like `min`, `max`, `email` do not run
  | validations when a value is non existing. Which means an empty
  | string will pass the email validation when `existyStrict = false`.
  |
  */
  existyStrict: false,

  /*
  |--------------------------------------------------------------------------
  | Remove additional
  |--------------------------------------------------------------------------
  |
  | When set to `true`, the validator will remove all non-validated properties
  | from the original data object. For example:
  |
  | - Original data = { username: 'virk', age: 28 }
  | - Validation schema = { username: 'required' }
  | - Validated data = { username: 'virk' }
  |
  | The validator will drop the `age` property, since it was never validated and
  | hence cannot be trusted. Also, the original object is untouched, a new copy
  | is created instead.
  |
  */
  removeAdditional: true,

  /*
  |--------------------------------------------------------------------------
  | Formatter
  |--------------------------------------------------------------------------
  |
  | Formatters defines the shape of error messages returned by the validator.
  |
  | The `vanilla` formatter is recommended when writing server rendered apps or
  | not following any specific json specification.
  |
  | The `jsonapi` formatter is recommended when you or your team is using
  | JSONAPI spec.
  |
  | You can also create your own formatters by implementing
  | `ValidatorFormatterContract`.
  */
  formatter: formatters.vanilla,
}

export default validatorConfig

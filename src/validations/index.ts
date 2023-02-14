/*
 * @adonisjs/validator
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { distinct } from './array/distinct.js'

import { after } from './date/after.js'
import { afterOrEqual } from './date/after_or_equal.js'
import { afterField } from './date/after_field.js'
import { afterOrEqualToField } from './date/after_or_equal_to_field.js'

import { before } from './date/before.js'
import { beforeOrEqual } from './date/before_or_equal.js'
import { beforeField } from './date/before_field.js'
import { beforeOrEqualToField } from './date/before_or_equal_to_field.js'

import { confirmed } from './existence/confirmed.js'
import { required } from './existence/required.js'
import { nullable } from './existence/nullable.js'
import { requiredIfExists } from './existence/required_if_exists.js'
import { requiredIfExistsAll } from './existence/required_if_exists_all.js'
import { requiredIfExistsAny } from './existence/required_if_exists_any.js'
import { requiredIfNotExists } from './existence/required_if_not_exists.js'
import { requiredIfNotExistsAll } from './existence/required_if_not_exists_all.js'
import { requiredIfNotExistsAny } from './existence/required_if_not_exists_any.js'
import { requiredWhen } from './existence/required_when.js'

import { notIn } from './miscellaneous/not_in.js'

import { unsigned } from './number/unsigned.js'
import { range } from './number/range.js'
import { array } from './primitives/array.js'
import { boolean } from './primitives/boolean.js'
import { date } from './primitives/date.js'
import { oneOf } from './primitives/enum.js'
import { enumSet } from './primitives/enum_set.js'
import { file } from './primitives/file.js'
import { number } from './primitives/number.js'
import { object } from './primitives/object.js'
import { string } from './primitives/string.js'

import { alpha } from './string/alpha.js'
import { alphaNum } from './string/alpha_num.js'
import { regex } from './string/regex.js'
import { escape } from './string/escape.js'
import { trim } from './string/trim.js'
import { email } from './string/email.js'
import { normalizeEmail } from './string/normalize_email.js'
import { url } from './string/url.js'
import { normalizeUrl } from './string/normalize_url.js'
import { ip } from './string/ip.js'
import { uuid } from './string/uuid.js'
import { mobile } from './string/mobile.js'
import { maxLength } from './string_and_array/max_length.js'
import { minLength } from './string_and_array/min_length.js'
import { equalTo } from './string/equal_to.js'

const validations = {
  distinct,
  after,
  afterOrEqual,
  afterField,
  afterOrEqualToField,
  before,
  beforeOrEqual,
  beforeField,
  beforeOrEqualToField,
  confirmed,
  required,
  nullable,
  requiredIfExists,
  requiredIfExistsAll,
  requiredIfExistsAny,
  requiredIfNotExists,
  requiredIfNotExistsAll,
  requiredIfNotExistsAny,
  requiredWhen,
  notIn,
  unsigned,
  range,
  array,
  boolean,
  date,
  enum: oneOf,
  enumSet,
  file,
  number,
  object,
  string,
  alpha,
  alphaNum,
  regex,
  escape,
  trim,
  email,
  normalizeEmail,
  url,
  normalizeUrl,
  ip,
  uuid,
  mobile,
  maxLength,
  minLength,
  equalTo,
}

export default validations

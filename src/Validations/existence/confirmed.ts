/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { exists, getFieldValue, wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'confirmed'
const DEFAULT_MESSAGE = 'confirmed validation failed'

/**
 * Ensures that the field value has been confirmed using `{{field}}_confirmation` field.
 * Useful for password confirmation.
 */
export const confirmed: SyncValidation = {
	compile: wrapCompile(RULE_NAME),
	validate(value, _, { errorReporter, field, pointer, arrayExpressionPointer, root, tip }) {
		if (!exists(value)) {
			return
		}

		/**
		 * We check to same value is not the type. Since it's possible that the original
		 * value is casted using a sub rule like `number`. However, the confirmed
		 * value is still a string.
		 *
		 * For example:
		 * age: schema.number([ rules.confirmed() ])
		 *
		 * Over HTTP the `age` and the `age_confirmation` field will both be strings. However,
		 * the `number` rule will cast the `age` to a number. So the type check with the
		 * confirmed rule will fail.
		 */
		// eslint-disable-next-line eqeqeq
		if (getFieldValue(`${field}_confirmation`, root, tip) != value) {
			errorReporter.report(
				`${pointer}_confirmation`,
				RULE_NAME,
				DEFAULT_MESSAGE,
				arrayExpressionPointer
			)
		}
	},
}

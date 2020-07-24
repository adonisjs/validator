/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'unsigned'
const DEFAULT_MESSAGE = 'unsigned validation failed'

export const unsigned: SyncValidation = {
	compile: wrapCompile(RULE_NAME, ['number']),
	validate(value, _, { errorReporter, arrayExpressionPointer, pointer }) {
		if (typeof value !== 'number') {
			return
		}

		if (value < 0) {
			errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
		}
	},
}

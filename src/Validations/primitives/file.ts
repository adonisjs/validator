/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { MultipartFileContract, FileValidationOptions } from '@ioc:Adonis/Core/BodyParser'
import { wrapCompile } from '../../Validator/helpers'

const DEFAULT_MESSAGE = 'file validation failed'
const RULE_NAME = 'file'

/**
 * Ensure the value is a valid file instance
 */
export const file: SyncValidation<Partial<FileValidationOptions>> = {
  compile: wrapCompile(RULE_NAME, [], ([ options ]) => {
    return {
      compiledOptions: options ? { size: options.size, extnames: options.extnames } : {},
    }
  }),
  validate (
    fileToValidate: MultipartFileContract,
    compiledOptions,
    { errorReporter, pointer, arrayExpressionPointer },
  ) {
    /**
     * Raise error when not a multipart file instance
     */
    if (!fileToValidate.isMultipartFile) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
      return
    }

    /**
     * Set size when it's defined by in the options
     */
    if (fileToValidate.sizeLimit === undefined && compiledOptions.size) {
      fileToValidate.sizeLimit = compiledOptions.size
    }

    /**
     * Set extensions when it's defined in the options
     */
    if (fileToValidate.allowedExtensions === undefined && compiledOptions.extnames) {
      fileToValidate.allowedExtensions = compiledOptions.extnames
    }

    /**
     * Validate the file
     */
    fileToValidate.validate()

    /**
     * Report errors
     */
    fileToValidate.errors.forEach((error) => {
      errorReporter.report(
        pointer,
        `${RULE_NAME}.${error.type}`,
        error.message,
        arrayExpressionPointer,
      )
    })
  },
}

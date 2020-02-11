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

const DEFAULT_MESSAGE = 'file validation failed'

/**
 * Ensure the value is a valid file instance
 */
export const file: SyncValidation<Partial<FileValidationOptions>> = {
  compile (_, __, options) {
    return {
      allowUndefineds: false,
      async: false,
      name: 'file',
      compiledOptions: options || {},
    }
  },
  validate (
    fileToValidate: MultipartFileContract,
    compiledOptions,
    { errorReporter, pointer, arrayExpressionPointer },
  ) {
    /**
     * Raise error when not a multipart file instance
     */
    if (!fileToValidate.isMultipartFile) {
      errorReporter.report(
        pointer,
        'file',
        DEFAULT_MESSAGE,
        arrayExpressionPointer,
      )
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
        `file.${error.type}`,
        error.message,
        arrayExpressionPointer,
      )
    })
  },
}

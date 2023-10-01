import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { wrapCompile } from '../../Validator/helpers'

const RULE_NAME = 'min'
const DEFAULT_MESSAGE = 'min validation failed'

export const minimum: SyncValidation<{ min: number }> = {
  compile: wrapCompile(RULE_NAME, ['number'], ([min]) => {
    if (typeof min !== 'number') {
      throw new Error(`The min value for "${RULE_NAME}" must be defined as number`)
    }
    return {
      compiledOptions: {
        min,
      },
    }
  }),
  validate(value, compiledOptions, { errorReporter, pointer, arrayExpressionPointer }) {
    if (typeof value !== 'number') {
      return
    }
    if (value < compiledOptions.min) {
      errorReporter.report(
        pointer,
        RULE_NAME,
        DEFAULT_MESSAGE,
        arrayExpressionPointer,
        compiledOptions
      )
    }
  },
}

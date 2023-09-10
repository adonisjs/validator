/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { getLiteralType, getObjectType, getArrayType } from '../utils'

import {
  Rule,
  Schema,
  DateType,
  EnumType,
  FileType,
  SchemaRef,
  ArrayType,
  StringType,
  ObjectType,
  NumberType,
  BigIntType,
  EnumSetType,
  BooleanType,
  TypedSchema,
  ParsedSchemaTree,
} from '@ioc:Adonis/Core/Validator'

/**
 * String schema type
 */
function string(options?: { escape?: boolean; trim?: boolean } | Rule[], rules?: Rule[]) {
  if (!rules && Array.isArray(options)) {
    rules = options
    options = {}
  }
  return getLiteralType('string', false, false, options, rules || []) as ReturnType<StringType>
}
string.optional = function optionalString(
  options?: { escape?: boolean; trim?: boolean } | Rule[],
  rules?: Rule[]
) {
  if (!rules && Array.isArray(options)) {
    rules = options
    options = {}
  }
  return getLiteralType('string', true, false, options, rules || []) as ReturnType<
    StringType['optional']
  >
}
string.nullable = function nullableString(
  options?: { escape?: boolean; trim?: boolean } | Rule[],
  rules?: Rule[]
) {
  if (!rules && Array.isArray(options)) {
    rules = options
    options = {}
  }
  return getLiteralType('string', false, true, options, rules || []) as ReturnType<
    StringType['nullable']
  >
}
string.nullableAndOptional = function nullableAndOptionalString(
  options?: { escape?: boolean; trim?: boolean } | Rule[],
  rules?: Rule[]
) {
  if (!rules && Array.isArray(options)) {
    rules = options
    options = {}
  }
  return getLiteralType('string', true, true, options, rules || []) as ReturnType<
    StringType['nullableAndOptional']
  >
}

/**
 * Boolean schema type
 */
function boolean(rules?: Rule[]) {
  return getLiteralType('boolean', false, false, undefined, rules || []) as ReturnType<BooleanType>
}
boolean.optional = function optionalBoolean(rules?: Rule[]) {
  return getLiteralType('boolean', true, false, undefined, rules || []) as ReturnType<
    BooleanType['optional']
  >
}
boolean.nullable = function nullableBoolean(rules?: Rule[]) {
  return getLiteralType('boolean', false, true, undefined, rules || []) as ReturnType<
    BooleanType['nullable']
  >
}
boolean.nullableAndOptional = function nullableAndOptionalBoolean(rules?: Rule[]) {
  return getLiteralType('boolean', true, true, undefined, rules || []) as ReturnType<
    BooleanType['nullableAndOptional']
  >
}

/**
 * Number schema type
 */
function number(rules?: Rule[]) {
  return getLiteralType('number', false, false, undefined, rules || []) as ReturnType<NumberType>
}
number.optional = function optionalNumber(rules?: Rule[]) {
  return getLiteralType('number', true, false, undefined, rules || []) as ReturnType<
    NumberType['optional']
  >
}
number.nullable = function nullableNumber(rules?: Rule[]) {
  return getLiteralType('number', false, true, undefined, rules || []) as ReturnType<
    NumberType['nullable']
  >
}
number.nullableAndOptional = function nullableAndOptionalNumber(rules?: Rule[]) {
  return getLiteralType('number', true, true, undefined, rules || []) as ReturnType<
    NumberType['nullableAndOptional']
  >
}

/**
 * bigint schema type
 */
function bigint(rules?: Rule[]) {
  return getLiteralType('bigint', false, false, undefined, rules || []) as ReturnType<BigIntType>
}
bigint.optional = function optionalBigInt(rules?: Rule[]) {
  return getLiteralType('bigint', true, false, undefined, rules || []) as ReturnType<
    BigIntType['optional']
  >
}
bigint.nullable = function nullableBigInt(rules?: Rule[]) {
  return getLiteralType('bigint', false, true, undefined, rules || []) as ReturnType<
    BigIntType['nullable']
  >
}
bigint.nullableAndOptional = function nullableAndOptionalBigInt(rules?: Rule[]) {
  return getLiteralType('bigint', true, true, undefined, rules || []) as ReturnType<
    BigIntType['nullableAndOptional']
  >
}

/**
 * Date schema type
 */
function date(options?: { format: string }, rules?: Rule[]) {
  return getLiteralType('date', false, false, options, rules || []) as ReturnType<DateType>
}
date.optional = function optionalDate(options?: { format: string }, rules?: Rule[]) {
  return getLiteralType('date', true, false, options, rules || []) as ReturnType<
    DateType['optional']
  >
}
date.nullable = function nullableDate(options?: { format: string }, rules?: Rule[]) {
  return getLiteralType('date', false, true, options, rules || []) as ReturnType<
    DateType['nullable']
  >
}
date.nullableAndOptional = function nullableAndOptionalDate(
  options?: { format: string },
  rules?: Rule[]
) {
  return getLiteralType('date', true, true, options, rules || []) as ReturnType<
    DateType['nullableAndOptional']
  >
}

/**
 * Object schema type
 */
function object(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getObjectType(
        false,
        false,
        Object.keys(schema).reduce((result, field) => {
          result[field] = schema[field].getTree()
          return result
        }, {}),
        rules || []
      )
    },
    anyMembers() {
      return getObjectType(false, false, null, rules || [])
    },
  } as ReturnType<ObjectType>
}
object.optional = function optionalObject(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getObjectType(
        true,
        false,
        Object.keys(schema).reduce((result, field) => {
          result[field] = schema[field].getTree()
          return result
        }, {}),
        rules || []
      )
    },
    anyMembers() {
      return getObjectType(true, false, null, rules || [])
    },
  } as ReturnType<ObjectType['optional']>
}
object.nullable = function nullableObject(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getObjectType(
        false,
        true,
        Object.keys(schema).reduce((result, field) => {
          result[field] = schema[field].getTree()
          return result
        }, {}),
        rules || []
      )
    },
    anyMembers() {
      return getObjectType(false, true, null, rules || [])
    },
  } as ReturnType<ObjectType['nullable']>
}
object.nullableAndOptional = function nullableAndOptionalObject(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getObjectType(
        true,
        true,
        Object.keys(schema).reduce((result, field) => {
          result[field] = schema[field].getTree()
          return result
        }, {}),
        rules || []
      )
    },
    anyMembers() {
      return getObjectType(true, true, null, rules || [])
    },
  } as ReturnType<ObjectType['nullableAndOptional']>
}

/**
 * Array schema type
 */
function array(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getArrayType(false, false, schema.getTree(), rules || [])
    },
    anyMembers() {
      return getArrayType(false, false, null, rules || [])
    },
  } as ReturnType<ArrayType>
}
array.optional = function optionalArray(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getArrayType(true, false, schema.getTree(), rules || [])
    },
    anyMembers() {
      return getArrayType(true, false, null, rules || [])
    },
  } as ReturnType<ArrayType['optional']>
}
array.nullable = function nullableArray(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getArrayType(false, true, schema.getTree(), rules || [])
    },
    anyMembers() {
      return getArrayType(false, true, null, rules || [])
    },
  } as ReturnType<ArrayType['nullable']>
}
array.nullableAndOptional = function nullableAndOptionalArray(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getArrayType(true, true, schema.getTree(), rules || [])
    },
    anyMembers() {
      return getArrayType(true, true, null, rules || [])
    },
  } as ReturnType<ArrayType['nullableAndOptional']>
}

/**
 * Enum schema type
 */
function oneOf(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enum', false, false, enumOptions, rules || []) as ReturnType<EnumType>
}
oneOf.optional = function optionalEnum(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enum', true, false, enumOptions, rules || []) as ReturnType<
    EnumType['optional']
  >
}
oneOf.nullable = function nullableEnum(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enum', false, true, enumOptions, rules || []) as ReturnType<
    EnumType['nullable']
  >
}
oneOf.nullableAndOptional = function nullableAndOptionalEnum(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enum', true, true, enumOptions, rules || []) as ReturnType<
    EnumType['nullableAndOptional']
  >
}

/**
 * Enum set schema type
 */
function enumSet(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType(
    'enumSet',
    false,
    false,
    enumOptions,
    rules || []
  ) as ReturnType<EnumSetType>
}
enumSet.optional = function optionalEnumSet(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enumSet', true, false, enumOptions, rules || []) as ReturnType<
    EnumSetType['optional']
  >
}
enumSet.nullable = function nullableEnumSet(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enumSet', false, true, enumOptions, rules || []) as ReturnType<
    EnumSetType['nullable']
  >
}
enumSet.nullableAndOptional = function nullableAndOptionalEnumSet(
  enumOptions: any[],
  rules?: Rule[]
) {
  return getLiteralType('enumSet', true, true, enumOptions, rules || []) as ReturnType<
    EnumSetType['nullableAndOptional']
  >
}

/**
 * File schema type
 */
function file(options: any, rules?: Rule[]) {
  return getLiteralType('file', false, false, options, rules || []) as ReturnType<FileType>
}
file.optional = function optionalFile(options: any, rules?: Rule[]) {
  return getLiteralType('file', true, false, options, rules || []) as ReturnType<
    FileType['optional']
  >
}
file.nullable = function nullableFile(options: any, rules?: Rule[]) {
  return getLiteralType('file', false, true, options, rules || []) as ReturnType<
    FileType['nullable']
  >
}
file.nullableAndOptional = function nullableAndOptionalFile(options: any, rules?: Rule[]) {
  return getLiteralType('file', true, true, options, rules || []) as ReturnType<
    FileType['nullableAndOptional']
  >
}

/**
 * Define refs, which are resolved at runtime vs the compile time
 */
function refs<T extends Object>(schemaRefs: T): { [P in keyof T]: SchemaRef<T[P]> } {
  return Object.keys(schemaRefs).reduce((result, key: string) => {
    result[key] = {
      __$isRef: true,
      value: schemaRefs[key],
      key: key,
    }
    return result
  }, {} as { [P in keyof T]: SchemaRef<T[P]> })
}

/**
 * List of available schema methods. One can add custom types by
 * using the extend method
 */
export const schema: Schema = {
  string,
  boolean,
  number,
  bigint,
  date,
  object,
  array,
  enum: oneOf as unknown as EnumType,
  enumSet: enumSet as unknown as EnumSetType,
  file,
  refs,

  /**
   * Create a new schema compiled schema tree
   */
  create<T extends TypedSchema>(
    tree: T
  ): {
    props: { [P in keyof T]: T[P]['t'] }
    tree: ParsedSchemaTree
  } {
    return {
      props: {} as { [P in keyof T]: T[P]['t'] },
      tree: Object.keys(tree).reduce((result, field) => {
        result[field] = tree[field].getTree()
        return result
      }, {}),
    }
  },
}

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
  EnumSetType,
  BooleanType,
  TypedSchema,
  ParsedSchemaTree,
  StringOptions,
} from '@ioc:Adonis/Core/Validator'

/**
 * String schema type
 */
function string(options?: StringOptions, rules?: Rule[]) {
  return getLiteralType('string', false, options, rules || []) as ReturnType<StringType>
}
string.optional = function optionalString(options?: StringOptions, rules?: Rule[]) {
  return getLiteralType('string', true, options, rules || []) as ReturnType<StringType['optional']>
}

/**
 * Boolean schema type
 */
function boolean(rules?: Rule[]) {
  return getLiteralType('boolean', false, undefined, rules || []) as ReturnType<BooleanType>
}
boolean.optional = function optionalBoolean(rules?: Rule[]) {
  return getLiteralType('boolean', true, undefined, rules || []) as ReturnType<
    BooleanType['optional']
  >
}

/**
 * Number schema type
 */
function number(rules?: Rule[]) {
  return getLiteralType('number', false, undefined, rules || []) as ReturnType<NumberType>
}
number.optional = function optionalNumber(rules?: Rule[]) {
  return getLiteralType('number', true, undefined, rules || []) as ReturnType<
    NumberType['optional']
  >
}

/**
 * Date schema type
 */
function date(options?: { format: string }, rules?: Rule[]) {
  return getLiteralType('date', false, options, rules || []) as ReturnType<DateType>
}
date.optional = function optionalDate(options?: { format: string }, rules?: Rule[]) {
  return getLiteralType('date', true, options, rules || []) as ReturnType<DateType['optional']>
}

/**
 * Object schema type
 */
function object(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getObjectType(
        false,
        Object.keys(schema).reduce((result, field) => {
          result[field] = schema[field].getTree()
          return result
        }, {}),
        rules || []
      )
    },
    anyMembers() {
      return getObjectType(false, null, rules || [])
    },
  } as ReturnType<ObjectType>
}
object.optional = function optionalObject(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getObjectType(
        true,
        Object.keys(schema).reduce((result, field) => {
          result[field] = schema[field].getTree()
          return result
        }, {}),
        rules || []
      )
    },
    anyMembers() {
      return getObjectType(true, null, rules || [])
    },
  } as ReturnType<ObjectType['optional']>
}

/**
 * Array schema type
 */
function array(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getArrayType(false, schema.getTree(), rules || [])
    },
    anyMembers() {
      return getArrayType(false, null, rules || [])
    },
  } as ReturnType<ArrayType>
}
array.optional = function optionalArray(rules?: Rule[]) {
  return {
    members(schema: any) {
      return getArrayType(true, schema.getTree(), rules || [])
    },
    anyMembers() {
      return getArrayType(true, null, rules || [])
    },
  } as ReturnType<ArrayType['optional']>
}

/**
 * Enum schema type
 */
function oneOf(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enum', false, enumOptions, rules || []) as ReturnType<EnumType>
}
oneOf.optional = function optionalEnum(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enum', true, enumOptions, rules || []) as ReturnType<EnumType['optional']>
}

/**
 * Enum set schema type
 */
function enumSet(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enumSet', false, enumOptions, rules || []) as ReturnType<EnumSetType>
}
enumSet.optional = function optionalEnumSet(enumOptions: any[], rules?: Rule[]) {
  return getLiteralType('enumSet', true, enumOptions, rules || []) as ReturnType<
    EnumSetType['optional']
  >
}

/**
 * File schema type
 */
function file(options: any, rules?: Rule[]) {
  return getLiteralType('file', false, options, rules || []) as ReturnType<FileType>
}
file.optional = function optionalFile(options: any, rules?: Rule[]) {
  return getLiteralType('file', true, options, rules || []) as ReturnType<FileType['optional']>
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

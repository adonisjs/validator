/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
	Rule,
	ParsedRule,
	SchemaArray,
	SchemaObject,
	SchemaLiteral,
	ParsedSchemaTree,
} from '@ioc:Adonis/Core/Validator'

import { rules as schemaRules } from './Rules'
import * as validations from './Validations'

/**
 * Compiles the `Rule` object and returns `ParsedRule` object.
 */
export function compileRule(type: string, subtype: string, rule: Rule, tree: any): ParsedRule {
	const ruleValidation = validations[rule.name]
	if (!ruleValidation) {
		throw new Error(`"${rule.name}" rule is not registered. Use "validator.rule" to add the rule.`)
	}

	if (typeof ruleValidation.compile !== 'function') {
		throw new Error(`"${rule.name}" rule must implement the compile function`)
	}

	if (typeof ruleValidation.validate !== 'function') {
		throw new Error(`"${rule.name}" rule must implement the validate function`)
	}

	const options = ruleValidation.compile(type, subtype, rule.options, tree)
	tree[rule.name] = options.compiledOptions

	return options
}

/**
 * Dry function to define a literal type
 */
export function getLiteralType(
	subtype: string,
	isOptional: boolean,
	ruleOptions: any,
	rules: Rule[]
): { getTree(): SchemaLiteral } {
	const subTypeRule = rules.find((rule) => rule.name === subtype)
	const optionsTree = {}

	return {
		getTree() {
			return {
				type: 'literal' as const,
				subtype: subtype,
				rules: ([] as Rule[])
					.concat(isOptional ? [] : [schemaRules.required()])
					.concat(subTypeRule ? [] : [schemaRules[subtype](ruleOptions)])
					.concat(rules)
					.map((rule) => compileRule('literal', subtype, rule, optionsTree)),
			}
		},
	}
}

/**
 * Dry function to define an object type
 */
export function getObjectType(
	isOptional: boolean,
	children: ParsedSchemaTree | null,
	rules: Rule[]
): { getTree(): SchemaObject } {
	const subTypeRule = rules.find((rule) => rule.name === 'object')
	const optionsTree = {}

	return {
		getTree() {
			return {
				type: 'object' as const,
				rules: ([] as Rule[])
					.concat(isOptional ? [] : [{ name: 'required', options: [] }])
					.concat(subTypeRule ? [] : [{ name: 'object', options: [] }])
					.concat(rules)
					.map((rule) => compileRule('object', 'object', rule, optionsTree)),
				...(children ? { children } : {}),
			}
		},
	}
}

/**
 * Dry function to define an array type
 */
export function getArrayType(
	isOptional: boolean,
	each: SchemaLiteral | SchemaObject | SchemaArray | null,
	rules: Rule[]
): { getTree(): SchemaArray } {
	const subTypeRule = rules.find((rule) => rule.name === 'array')
	const optionsTree = {}

	return {
		getTree() {
			return {
				type: 'array' as const,
				rules: ([] as Rule[])
					.concat(isOptional ? [] : [{ name: 'required', options: [] }])
					.concat(subTypeRule ? [] : [{ name: 'array', options: [] }])
					.concat(rules)
					.map((rule) => compileRule('array', 'array', rule, optionsTree)),
				...(each ? { each } : {}),
			}
		},
	}
}

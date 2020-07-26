import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

const refs = schema.refs({
	afterDate: DateTime.local(),
})

const data = schema.create({
	username: schema.date({}, [rules.after('tomorrow'), rules.after(refs.afterDate)]),
	profile: schema.object().anyMembers(),
}).props

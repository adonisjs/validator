// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import { DateTime } from 'luxon'

// const refs = schema.refs({
// 	afterDate: DateTime.local(),
// })

// const data = schema.create({
// 	username: schema.date({}, [rules.before(2, 'days'), rules.before(refs.afterDate)]),
// 	profile: schema.object().anyMembers(),
// }).props

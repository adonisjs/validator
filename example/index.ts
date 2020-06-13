import { schema, validator } from '@ioc:Adonis/Core/Validator'

enum Statuses {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING'
}

function getStatuses (): Statuses[] {
  if (new Date().getTime() < 13) {
    return Object.values(Statuses)
  }

  return Object.values(Statuses)
}

const statuses = getStatuses()
// ref<typeof statuses>('statuses')

const a = schema.create({
  status: schema.enum(Object.values(Statuses)),
})

export class Foo {
  public statuses = getStatuses()
  // public ref = ref

  public refs = schema.refs({
    statuses: statuses,
  })

  public validationSchema = schema.create({
    status: schema.enumSet(this.refs.statuses),
  })
}

// validator.rule('phone', (value, options) => {
//   options
// }).acceptOptions((options) => {
//   return {
//     isUndefined: true,
//   }
// })

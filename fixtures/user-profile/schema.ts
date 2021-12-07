import { schema as schemaBuilder } from '../../src/Schema'

export function schema() {
  return schemaBuilder.create({
    username: schemaBuilder.string(),
    password: schemaBuilder.string.nullableAndOptional(),
    profile_picture: schemaBuilder.string.nullable(),
    age: schemaBuilder.number(),
    about: schemaBuilder.string.optional(),
  })
}

export function title() {
  return 'User profile'
}

export function useCases() {
  return [
    {
      data: {
        username: 'virk',
        age: 32,
      },
      fails: true,
      errors: {
        profile_picture: ['nullable validation failed'],
      },
      output: null,
    },
    {
      data: {
        username: 'virk',
        profile_picture: null,
        age: 32,
        about: null,
      },
      fails: false,
      errors: [],
      output: {
        username: 'virk',
        profile_picture: null,
        age: 32,
      },
    },
  ]
}

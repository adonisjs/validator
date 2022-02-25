import { Assert } from '@japa/assert'

declare module '@japa/runner' {
  interface TestContext {
    // notify TypeScript about custom context properties
    assert: Assert
  }

  interface Test<Context, TestData> {
    // notify TypeScript about custom test properties
  }
}

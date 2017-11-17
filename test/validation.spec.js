'use strict'

/*
 * adonis-validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const Validation = require('../src/Validation')

test.group('Validation', () => {
  test('do not throw on validation errors', async (assert) => {
    const validation = new Validation({ email: '' }, { email: 'required' })
    await validation.run()
    assert.isArray(validation._errorMessages)
  })

  test('return true from fails when there are validation errors', async (assert) => {
    const validation = new Validation({ email: '' }, { email: 'required' })
    await validation.run()
    assert.isTrue(validation.fails())
  })

  test('return array of error message', async (assert) => {
    const validation = new Validation({ email: '' }, { email: 'required' })
    await validation.run()
    assert.deepEqual(validation.messages(), [{
      field: 'email',
      validation: 'required',
      message: 'required validation failed on email'
    }])
  })

  test('throw exception when trying to rerun validation multiple times', async (assert) => {
    assert.plan(1)

    const validation = new Validation({ email: '' }, { email: 'required' })
    await validation.run()
    try {
      await validation.run()
    } catch ({ message }) {
      assert.equal(message, 'Cannot re-run validations on same data and rules')
    }
  })

  test('run all validations', async (assert) => {
    assert.plan(1)

    const validation = new Validation({ email: '' }, { email: 'required', age: 'required' })
    await validation.runAll()
    assert.deepEqual(validation.messages(), [
      {
        field: 'email',
        validation: 'required',
        message: 'required validation failed on email'
      },
      {
        field: 'age',
        validation: 'required',
        message: 'required validation failed on age'
      }
    ])
  })

  test('show custom error messages', async (assert) => {
    assert.plan(1)

    const validation = new Validation(
      { email: '' },
      { email: 'required', age: 'required' },
      { 'email.required': 'Enter email please' }
    )

    await validation.run()

    assert.deepEqual(validation.messages(), [
      {
        field: 'email',
        validation: 'required',
        message: 'Enter email please'
      }
    ])
  })

  test('use jsonapi formatter', async (assert) => {
    assert.plan(1)

    const validation = new Validation(
      { email: '' },
      { email: 'required', age: 'required' },
      { 'email.required': 'Enter email please' },
      'jsonapi'
    )

    await validation.run()
    assert.deepEqual(validation.messages(), {
      errors: [
        {
          source: { pointer: 'email' },
          title: 'required',
          detail: 'Enter email please'
        }
      ]
    })
  })
})

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
const { Helpers } = require('@adonisjs/sink')
const { Command } = require('@adonisjs/ace')
const MakeValidator = require('../commands/MakeValidator')
const path = require('path')

test.group('Make Validator', (group) => {
  group.before(async () => {
    await new Command().pathExists(path.join(__dirname, './app'))
  })

  group.beforeEach(async () => {
    await new Command().emptyDir(path.join(__dirname, './app'))
  })

  group.after(async () => {
    await new Command().removeDir(path.join(__dirname, './app'))
  })

  test('make a validator class', async (assert) => {
    const make = new MakeValidator(new Helpers(path.join(__dirname)))
    await make.handle({ name: 'User' })
    const User = require(path.join(__dirname, './app/Validators/User'))
    assert.equal(User.name, 'User')
    assert.deepEqual(new User().rules, {})
  })

  test('return error when file already exists', async (assert) => {
    assert.plan(1)

    const make = new MakeValidator(new Helpers(path.join(__dirname, './app')))
    await make.handle({ name: 'User' })
    try {
      await make.handle({ name: 'User' })
    } catch ({ message }) {
      assert.match(message, /User\.js already exists/)
    }
  })
})

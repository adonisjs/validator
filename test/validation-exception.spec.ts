/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/// <reference path="../adonis-typings/index.ts" />

import test from 'japa'
import { Socket } from 'net'
import { IncomingMessage, ServerResponse } from 'http'
import { Logger } from '@adonisjs/logger/build/standalone'
import { Session } from '@adonisjs/session/build/src/Session'
import { Profiler } from '@adonisjs/profiler/build/standalone'
import { Encryption } from '@adonisjs/encryption/build/standalone'
import { HttpContext as BaseContext } from '@adonisjs/http-server/build/standalone'
import { CookieDriver } from '@adonisjs/session/build/src/Drivers/Cookie'
import { HttpContextConstructorContract } from '@ioc:Adonis/Core/HttpContext'

import { ValidationException } from '../src/Exceptions/ValidationException'

const HttpContext = BaseContext as unknown as HttpContextConstructorContract
const logger = new Logger({ enabled: true, level: 'trace', name: 'adonis' })
const profiler = new Profiler({}).create('')
const encryption = new Encryption('verylongandrandom32charsecretkey')
const sessionOptions = {
  driver: 'cookie',
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: 3600,
  cookie: {},
}

test.group('Validation Exception', () => {
  test('return response as JSON when accept header asks for it', async (assert) => {
    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const ctx = HttpContext.create('/', {}, logger, profiler, encryption, req, res)
    ctx.request.request.headers = {
      accept: 'application/json',
    }

    const exception = new ValidationException([{ field: 'username', message: 'Required validation failure' }])
    await exception.handle(exception, ctx)

    assert.deepEqual(ctx.response.lazyBody!.args[0], {
      errors: [{
        field: 'username',
        message: 'Required validation failure',
      }],
    })
  })

  test('return plain text message when not using sessions', async (assert) => {
    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const ctx = HttpContext.create('/', {}, logger, profiler, encryption, req, res)
    const exception = new ValidationException([{ field: 'username', message: 'Required validation failure' }])
    await exception.handle(exception, ctx)

    assert.equal(ctx.response.lazyBody!.args[0], 'Required validation failure')
  })

  test('flash errors to the session when session store is defined', async (assert) => {
    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const ctx = HttpContext.create('/', {}, logger, profiler, encryption, req, res)
    const session = new Session(ctx, sessionOptions, new CookieDriver(sessionOptions, ctx))
    ctx.session = session
    await session.initiate(false)

    const exception = new ValidationException([{ field: 'username', message: 'Required validation failure' }])
    await exception.handle(exception, ctx)

    assert.deepEqual(ctx.session['flashMessagesStore'].others, {
      errors: {
        username: ['Required validation failure'],
      },
    })
  })

  test('flash input data along with errors', async (assert) => {
    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const ctx = HttpContext.create('/', {}, logger, profiler, encryption, req, res)
    const session = new Session(ctx, sessionOptions, new CookieDriver(sessionOptions, ctx))
    ctx.session = session
    ctx.request.setInitialBody({ username: 'virk' })
    await session.initiate(false)

    const exception = new ValidationException([{ field: 'username', message: 'Required validation failure' }])
    await exception.handle(exception, ctx)

    assert.deepEqual(ctx.session['flashMessagesStore'], {
      input: {
        username: 'virk',
      },
      others: {
        errors: {
          username: ['Required validation failure'],
        },
      },
    })
  })
})

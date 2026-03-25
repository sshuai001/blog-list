const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const { initDb, closeDb } = require('./helpers/db')
const { usersInDb, createUser } = require('./helpers/test_helper')

const api = supertest(app)

describe('User API', () => {
  before(async () => {
    // Wait for MongoDB connection to be established
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve)
      })
    }
    await initDb()
  })

  after(async () => {
    await closeDb()
  })

  describe('GET /api/users', () => {
    test('users are returned as json', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns empty array when no users exist', async () => {
      const users = await usersInDb(api)
      assert.strictEqual(users.length, 0)
    })

    test('returns all users', async () => {
      // 创建两个测试用户
      await createUser(api, {
        username: 'user1',
        name: 'User One',
        password: 'password123'
      })

      await createUser(api, {
        username: 'user2',
        name: 'User Two',
        password: 'password456'
      })

      const users = await usersInDb(api)
      assert.strictEqual(users.length, 2)
    })

    test('returned users do not contain passwordHash', async () => {
      await createUser(api, {
        username: 'testuser',
        name: 'Test User',
        password: 'password123'
      })

      const users = await usersInDb(api)
      const user = users.find(u => u.username === 'testuser')

      assert.ok(user)
      assert.strictEqual(user.passwordHash, undefined)
    })
  })

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await initDb()
    })

    test('creates a valid user with username, name and password', async () => {
      const newUser = {
        username: 'validuser',
        name: 'Valid User',
        password: 'validpass123'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.username, newUser.username)
      assert.strictEqual(response.body.name, newUser.name)
      assert.strictEqual(response.body.passwordHash, undefined)

      const users = await usersInDb(api)
      assert.strictEqual(users.length, 1)
    })

    test('fails with status 400 if username is missing', async () => {
      const newUser = {
        name: 'No Username',
        password: 'password123'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(response.body.error)
      assert.match(response.body.error, /username/i)
    })

    test('fails with status 400 if username is too short', async () => {
      const newUser = {
        username: 'ab',
        name: 'Short Username',
        password: 'password123'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(response.body.error)
      assert.match(response.body.error, /username/i)
    })

    test('fails with status 400 if password is missing', async () => {
      const newUser = {
        username: 'nopassword',
        name: 'No Password'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(response.body.error)
      assert.match(response.body.error, /password/i)
    })

    test('fails with status 400 if password is too short', async () => {
      const newUser = {
        username: 'shortpass',
        name: 'Short Password',
        password: 'ab'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(response.body.error)
      assert.match(response.body.error, /password/i)
    })

    test('fails with status 400 if username already exists', async () => {
      const user = {
        username: 'duplicate',
        name: 'First User',
        password: 'password123'
      }

      await createUser(api, user)

      const duplicateUser = {
        username: 'duplicate',
        name: 'Second User',
        password: 'password456'
      }

      const response = await api
        .post('/api/users')
        .send(duplicateUser)
        .expect(400)

      assert.ok(response.body.error)
      assert.match(response.body.error, /unique/i)
    })
  })
})

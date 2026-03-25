const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const { initDb, closeDb } = require('./helpers/db')
const { blogsInDb, createBlog, totalLikes } = require('./helpers/test_helper')

const api = supertest(app)

describe('Blog API', () => {
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

  describe('GET /api/blogs', () => {
    beforeEach(async () => {
      await initDb()
    })

    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns empty array when no blogs exist', async () => {
      const blogs = await blogsInDb(api)
      assert.strictEqual(blogs.length, 0)
    })

    test('unique identifier property of the blog posts is named id', async () => {
      // 先创建一个测试博客
      await createBlog(api, {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://test.com',
        likes: 5
      })

      const blogs = await blogsInDb(api)
      const blog = blogs[0]

      assert.ok(blog.id, 'Blog post should have an id property')
      assert.strictEqual(blog._id, undefined, 'Blog post should not have _id property')
    })
  })

  describe('POST /api/blogs', () => {
    beforeEach(async () => {
      await initDb()
    })

    test('a valid blog can be added', async () => {
      const blogsAtStart = await blogsInDb(api)
      const initialLength = blogsAtStart.length

      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://test.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb(api)
      assert.strictEqual(blogsAtEnd.length, initialLength + 1, 'Blog count should increase by 1')

      const addedBlog = blogsAtEnd.find(b => b.title === newBlog.title)
      assert.ok(addedBlog)
      assert.strictEqual(addedBlog.author, newBlog.author)
    })

    test('if request body does not contain likes, it will default to 0', async () => {
      const blogsAtStart = await blogsInDb(api)
      const initialLikes = totalLikes(blogsAtStart)

      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://test.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb(api)
      const endLikes = totalLikes(blogsAtEnd)

      assert.strictEqual(endLikes, initialLikes, 'Total likes should be 0 when likes is missing')

      const addedBlog = blogsAtEnd.find(b => b.title === newBlog.title)
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title and url is not added', async () => {
      const blogsAtStart = await blogsInDb(api)
      const initialLength = blogsAtStart.length

      const newBlog = {
        author: 'Test Author',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await blogsInDb(api)
      assert.strictEqual(blogsAtEnd.length, initialLength, 'No blog should be added')
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'https://test.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('blog without url is not added', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    beforeEach(async () => {
      await initDb()
    })

    test('a blog can be deleted', async () => {
      // 创建一个要删除的博客
      const newBlog = {
        title: 'Blog to Delete',
        author: 'Test Author',
        url: 'https://test.com',
        likes: 5
      }

      const blog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogId = blog.body.id

      await api
        .delete(`/api/blogs/${blogId}`)
        .expect(204)

      const blogsAtEnd = await blogsInDb(api)
      const deletedBlog = blogsAtEnd.find(b => b.id === blogId)

      assert.strictEqual(deletedBlog, undefined, 'Deleted blog should not exist')
    })

    test('deleting non-existent blog returns 404', async () => {
      const nonExistentId = '123456789012345678901234'

      await api
        .delete(`/api/blogs/${nonExistentId}`)
        .expect(404)
    })
  })

  describe('PUT /api/blogs/:id', () => {
    beforeEach(async () => {
      await initDb()
    })

    test('likes of a blog can be updated', async () => {
      const newBlog = {
        title: 'Blog to Update',
        author: 'Test Author',
        url: 'https://test.com',
        likes: 5
      }

      const blog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogId = blog.body.id
      const updatedLikes = blog.body.likes + 1

      await api
        .put(`/api/blogs/${blogId}`)
        .send({ likes: updatedLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb(api)
      const updatedBlog = blogsAtEnd.find(b => b.id === blogId)

      assert.strictEqual(updatedBlog.likes, updatedLikes, 'Blog likes should be updated')
    })

    test('updating non-existent blog returns 404', async () => {
      const nonExistentId = '123456789012345678901234'

      await api
        .put(`/api/blogs/${nonExistentId}`)
        .send({ likes: 10 })
        .expect(404)
    })
  })
})

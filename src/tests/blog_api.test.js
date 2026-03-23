const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json and right length', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .expect((response) => {
      Array.isArray(response.body) && response.body.length === 0
    })
})  
test ('unique identifier property of the blog posts is named id', async () => {
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  if (res.body.length > 0) {
    const blog = res.body[0]

    assert.ok(blog.id, 'Blog post have an id property')
    assert.strictEqual(blog._id, undefined, 'Blog post should not have _id property')
  }
})
test ('a valid blog can be added', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const initialLength = blogsAtStart.body.length

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
  const blogsAtEnd = await api.get('/api/blogs')
  const endLength = blogsAtEnd.body.length

  assert.strictEqual(endLength, initialLength + 1, 'Blog count should increase by 1')  
})
test ('if request body does not contain likes, it will default to 0', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const initialLikes = blogsAtStart.body.reduce((sum, blog) => sum + blog.likes, 0)

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

  const blogsAtEnd = await api.get('/api/blogs')
  const endLikes = blogsAtEnd.body.reduce((sum, blog) => sum + blog.likes, 0)

  assert.strictEqual(endLikes, initialLikes, 'Total likes should not change when likes is missing')
})
test ('blog without title and url is not added', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const initialLength = blogsAtStart.body.length

  const newBlog = {
    author: 'Test Author',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, initialLength, 'No blog should be added')
})
test ('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const initialLength = blogsAtStart.body.length

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

  const blogsAtEnd = await api.get('/api/blogs')
  assert.strictEqual(blogsAtEnd.body.length, initialLength, 'Blog count should be same after deletion')

  // 验证被删除的博客不存在
  const deletedBlog = blogsAtEnd.body.find(b => b.id === blogId)
  assert.strictEqual(deletedBlog, undefined, 'Deleted blog should not exist')
})
test ('likes of a blog can be updated', async () => {
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

  const blogsAtEnd = await api.get('/api/blogs')
  const updatedBlog = blogsAtEnd.body.find(b => b.id === blogId)
  assert.strictEqual(updatedBlog.likes, updatedLikes, 'Blog likes should be updated')

})

after(async () => {
  await mongoose.connection.close()
})
/**
 * 获取数据库中的所有博客
 */
const blogsInDb = async (api) => {
  const response = await api.get('/api/blogs')
  return response.body
}

/**
 * 获取数据库中的所有用户
 */
const usersInDb = async (api) => {
  const response = await api.get('/api/users')
  return response.body
}

/**
 * 创建一个新博客
 */
const createBlog = async (api, blogData) => {
  return await api
    .post('/api/blogs')
    .send(blogData)
}

/**
 * 创建一个新用户
 */
const createUser = async (api, userData) => {
  return await api
    .post('/api/users')
    .send(userData)
}

/**
 * 获取博客总数
 */
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

module.exports = {
  blogsInDb,
  usersInDb,
  createBlog,
  createUser,
  totalLikes
}

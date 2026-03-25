const mongoose = require('mongoose')
const User = require('../../models/user')
const Blog = require('../../models/blog')

/**
 * 初始化测试数据库 - 删除所有数据
 */
const initDb = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
}

/**
 * 关闭数据库连接
 */
const closeDb = async () => {
  await mongoose.connection.close()
}

module.exports = { initDb, closeDb }

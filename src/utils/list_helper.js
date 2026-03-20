const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  // ...
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const _ = require('lodash')

  // 1. 按作者分组
  const groupedByAuthor = _.groupBy(blogs, 'author')

  // 2. 转换为 { author: string, blogs: number } 数组
  const authorBlogCounts = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    blogs: blogs.length
  }))

  // 3. 找出博客数量最多的作者
  const top = _.maxBy(authorBlogCounts, 'blogs')

  return top
}
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const _ = require('lodash')

  const groupedByAuthor = _.groupBy(blogs, 'author')

  const authorLikeCounts = _.map(groupedByAuthor, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes')
  }))

  const top = _.maxBy(authorLikeCounts, 'likes')

  return top
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

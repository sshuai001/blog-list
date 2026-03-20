const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
  test('of a bigger list is calculated right', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',        
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Python for Beginners',
        author: 'John Doe',
        url: 'https://example.com/python-for-beginners',
        likes: 10,
        __v: 0
      }
    ]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 15)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })
    test('of empty list is null', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })
    test('of a bigger list is determined right', () => {
        const blogs = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f9',
                title: 'Python for Beginners',
                author: 'John Doe',
                url: 'https://example.com/python-for-beginners',
                likes: 10,
                __v: 0
            }
        ]

        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, {
            title: 'Python for Beginners',
            author: 'John Doe',
            likes: 10
        })
    })
})

describe('most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, returns that author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })
  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
  test('of a bigger list is determined right', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Python for Beginners',
        author: 'John Doe',
        url: 'https://example.com/python-for-beginners',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f0',
        title: 'Advanced Python',
        author: 'John Doe',
        url: 'https://example.com/advanced-python',
        likes: 8,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f1',
        title: 'Python Tips',
        author: 'John Doe',
        url: 'https://example.com/python-tips',
        likes: 12,
        __v: 0
      }
    ]

    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'John Doe',
      blogs: 3
    })
  })
})
describe('most likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, returns that author', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
  test('of a bigger list is determined right', () => {
    const blogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Python for Beginners',
        author: 'John Doe',
        url: 'https://example.com/python-for-beginners',
        likes: 10,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f0',
        title: 'Advanced Python',
        author: 'John Doe',
        url: 'https://example.com/advanced-python',
        likes: 8,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f1',
        title: 'Python Tips',
        author: 'John Doe',
        url: 'https://example.com/python-tips',
        likes: 12,
        __v: 0
      }
    ]

    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'John Doe',
      likes: 30
    })
  })
})

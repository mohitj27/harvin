const promise = require('bluebird')
const Forum = require('../models/Forum')

const findPost = post => {
  const query = post || {}
  return new promise((resolve, reject) => {
    Forum.find(query, (err, foundForumPost) => {
      if (err) reject(err)
      resolve(foundForumPost)
    })
  })
}
const savePost = post => {
  const forum = new Forum(post)
  return new Promise((resolve, reject) => {
    if (!post) reject('Post Undefined')
    Forum.create(forum, err => {
      if (err) reject(err)
      resolve('Post Updated')
    })
  })
}

const findForumById = function (forumId) {
  return new Promise(function (resolve, reject) {
    Forum.findById(forumId)
      .then(foundForum => resolve(foundForum))
      .catch(err => reject(err))
  })
}
module.exports = {
  findPost,
  savePost,
  findForumById
}

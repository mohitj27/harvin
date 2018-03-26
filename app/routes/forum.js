const express = require('express')
const path = require('path')
const moment = require('moment-timezone')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')
const validator = require('validator')
const forumController = require('../controllers/forum.controller')
const fileController = require('../controllers/file.controller')

const router = express.Router()
const FILE_DIR = path.normalize(__dirname + '/../../../HarvinDb/ForumUploads')

router.get('/newPost', async (req, res) => {
  try {
    const foundForumPost = await forumController.findPost()
    res.render('ForumPostDb', { foundForumPost })
  } catch (e) {
    next(e)
  } finally {
  }
})
router.post('/newPost', async (req, res, next) => {
  const postToSave = {
    postName: req.body.postName.replace(/\s/g, ''),
    uploadDate: moment(Date.now())
      .tz('Asia/Kolkata')
      .format('MMMM Do YYYY, h:mm:ss a'),
    filePath: `/ForumUploads/${req.files.file.name}`
  }
  try {
    await fileController.uploadFileToDirectory(
      FILE_DIR + '/' + req.files.file.name,
      req.files.file
    )
    const msg = await forumController.savePost(postToSave)
    req.flash('success', 'Successfully created new Forum Post')

    res.redirect('/admin/forum/newPost')
  } catch (e) {
    next(e)
  }
})

router.delete('/:forumId', async (req, res, next) => {
  const forumId = req.params.forumId || ''
  if (!forumId || !validator.isMongoId(forumId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'forum id', next)
  }

  try {
    let foundForum = await forumController.findForumById(forumId)

    if (!foundForum) {
      return errorHandler.errorResponse('NOT_FOUND', 'Forum', next)
    } else {
      foundForum.remove()
    }
    res.sendStatus(200)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

module.exports = router

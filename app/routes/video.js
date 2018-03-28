const express = require('express'),
  router = express.Router(),
  videoController = require('./../controllers/video.controller'),
  errorHandler = require('../errorHandler'),
  validator = require('validator'),
  middleware = require('../middleware')

router.get('/', middleware.isLoggedIn, async (req, res, next) => {
  try {
    let foundVideos = await videoController.findAllVideos()
    res.render('videosDb', { videos: foundVideos })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.delete('/:videoId', middleware.isLoggedIn, async (req, res, next) => {
  const videoId = req.params.videoId || ''
  if (!videoId || !validator.isMongoId(videoId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'Video id', next)
  }

  try {
    let foundVideo = await videoController.findVideoById(videoId)

    if (!foundVideo) {
      return errorHandler.errorResponse('NOT_FOUND', 'Video', next)
    } else {
      foundVideo.remove()
    }
    res.sendStatus(200)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.post('/', async (req, res, next) => {
  console.log('body', req.body)
  const date = Date.now()
  let newVideObj = req.body

  try {
    newVideObj.date = date
    console.log('newVideobj', newVideObj)
    await videoController.newVideo(newVideObj)
    req.flash('success', 'Video uploaded successfully')
    res.redirect('/admin/videos')
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})
module.exports = router

const express = require('express')
const router = express.Router()
const errorHandler = require('../errorHandler')
const moment = require('moment-timezone')
const _ = require('lodash')
const validator = require('validator')
const userController = require('../controllers/user.controller')
const fileController = require('../controllers/file.controller')
const visitorController = require('../controllers/visitor.controller')
const galleryController = require('../controllers/gallery.controller')
const path = require('path')
const multer = require('multer')
const middleware = require('../middleware')

var currTime = Date.now().toString() + '__'
var storage = multer.diskStorage({
  destination: path.join(__dirname, '/../../../', 'HarvinDb/img'),
  filename: function (req, file, callback) {
    callback(null, currTime + file.originalname)
  }
})

router.get('/', (req, res, next) => {
  res.render('dbCollection')
})

router.get('/users', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    const foundUsers = await userController.findAllUsers()
    const populatedUsers = await userController.populateFieldsInUsers(foundUsers, ['profile.batch'])
    return res.render('userProfileDb', {
      users: populatedUsers
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/users/:userId', async (req, res, next) => {
  const userId = req.params.userId || ''
  if (!userId || !validator.isMongoId(userId)) return errorHandler.errorResponse('INVALID_FIELD', 'user Id', next)

  try {
    let foundUser = await userController.findUserByUserId(userId)
    foundUser = await userController.populateFieldsInUsers(foundUser, ['profile', 'profile.results', 'profile.progresses'])

    const profile = foundUser.profile
    if (profile) {
      const results = foundUser.profile.results
      const progresses = foundUser.profile.progresses
      if (results) _.forEach(results, (result) => result.remove())
      if (progresses) _.forEach(progresses, (progress) => progress.remove())
      profile.remove()
    }

    foundUser.remove()

    req.flash('success', 'User account deleted successfully')
    res.redirect('/admin/db/users')
  } catch (err) {
    next(err)
  }
})

router.get('/files', async (req, res, next) => {
  try {
    const foundFiles = await fileController.findAllFiles()
    const populatedFiles = await fileController.populateFieldsInFiles(foundFiles, ['class', 'subject', 'chapter', 'topic'])
    return res.json(populatedFiles)
  } catch (err) {
    next(err)
  }
})

router.get('/visitors', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    const foundVisitors = await visitorController.findAllVisitors()
    res.render('visitorDb', {
      visitors: foundVisitors
    })
  } catch (err) {
    next(err)
  }
})

router.get('/gallery/upload', (req, res, next) => {
  res.render('insertGallery')
})

router.get('/gallery/all/:category', async (req, res, next) => {
  let categoryToDelete = req.params.category

  try {
    await galleryController.deleteCategory(categoryToDelete)
    req.flash('success', 'successfully deleted all items from current category')
    return res.redirect('/admin/db/gallery')
  } catch (err) {
    next(err)
  }
})

router.get('/gallery/:imageId/delete', async (req, res, next) => {
  let imageIdToDelete = req.params.imageId
  if (!imageIdToDelete || !validator.isMongoId(imageIdToDelete)) return errorHandler.errorResponse('INVALID_FIELD', 'Image id', next)

  try {
    const deletedImage = galleryController.deleteImageById(imageIdToDelete)
    if (!deletedImage) {
      req.flash('error', 'Item not found')
      return res.redirect('/admin/db/gallery')
    }
    req.flash('success', 'Image deleted successfully')
    res.redirect('/admin/db/gallery')
  } catch (err) {
    next(err)
  }
})

router.get('/gallery/all', async (req, res, next) => {
  try {
    const foundImages = await galleryController.findAllImages()
    res.json({
      images: foundImages
    })
  } catch (err) {
    next(err)
  }
})

router.get('/gallery', (req, res, next) => {
  res.render('galleryDb')
})

router.post('/gallery', (req, res, next) => {
  var upload = multer({
    storage: storage
  }).single('userFile')

  upload(req, res, async function (err) {
    if (err) return next(err)
    var fileName = req.file.originalname

    // absolute file path
    var filePath = req.file.path
    var srcList = filePath.split(path.sep)

    // relative file path (required by ejs file)
    var src = path.join('/', srcList[srcList.length - 2], srcList[srcList.length - 1])

    var uploadDate = moment(Date.now())
      .tz('Asia/Kolkata')
      .format('MMMM Do YYYY, h:mm:ss a')
    var description = req.body.description
    var category = req.body.category
    var thumbPath = path.join('/', srcList[srcList.length - 2], 'thumb', srcList[srcList.length - 1])

    var newFile = {
      fileName,
      src,
      uploadDate,
      description,
      category,
      thumbPath,
      filePath
    }

    try {
      const createdImage = await galleryController.createNewImage(newFile)
      galleryController.createThumbImg(createdImage)
      req.flash('success', fileName + ' uploaded successfully')
      res.redirect('/admin/db/gallery/upload')
    } catch (err) {
      next(err)
    }
  })
})

module.exports = router

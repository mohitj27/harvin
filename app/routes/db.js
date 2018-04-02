const express = require('express')
const router = express.Router()
const errorHandler = require('../errorHandler')
const moment = require('moment-timezone')
const _ = require('lodash')
const validator = require('validator')
const userController = require('../controllers/user.controller')
const profileController = require('../controllers/profile.controller')
const fileController = require('../controllers/file.controller')
const visitorController = require('../controllers/vms.controller')
const galleryController = require('../controllers/gallery.controller')
const batchController = require('../controllers/batch.controller')
const path = require('path')
const middleware = require('../middleware')

const GALLERY_DIR = path.normalize(
  path.join(__dirname, '/../../../HarvinDb/img/')
)

router.get('/', middleware.isLoggedIn, (req, res, next) => {
  res.render('dbCollection')
})

router.get(
  '/users',
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    try {
      let foundUsers = await userController.findAllUsers()

      foundUsers = foundUsers.filter(user => {
        if (
          _.findIndex(user.role, function (o) {
            return o === 'student'
          }) !== -1
        ) {
          return user
        }
      })
      const populatedUsers = await userController.populateFieldsInUsers(
        foundUsers,
        ['profile.batch']
      )
      return res.render('userProfileDb', {
        users: populatedUsers
      })
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.post('/users/:userId', middleware.isLoggedIn, async function (
  req,
  res,
  next
) {
  const userId = req.params.userId
  const batchId = req.body.batch


  const updateProfileObj = req.body

  // res.locals.flashUrl =
  //   req.headers.referrer || '/admin/db/users/' + userId + '/edit'

  if (!userId || !validator.isMongoId(userId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'user Id', next, true)
  }

  if (!batchId || !validator.isMongoId(batchId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'batch id', next)
  }

  try {
    let foundBatch = await batchController.findBatchById(batchId)
    if (!foundBatch) {
      return errorHandler.errorResponse('NOT_FOUND', 'batch', next)
    }

    updateProfileObj.batch = foundBatch

    let foundUser = await userController.findUserByUserId(userId)
    if (!foundUser) {
      return errorHandler.errorResponse(
        errorHandler.ERROR_TYPES.NOT_FOUND,
        'user',
        next,
        true
      )
    }

    foundUser = await userController.populateFieldsInUsers(foundUser, [
      'profile'
    ])

    if (foundUser.profile) {
      const updatedProfile = await profileController.updateFieldsInProfileById(
        foundUser.profile,
        {},
        updateProfileObj
      )

    } else {

      const createdProfile = await profileController.createNewProfile(
        updateProfileObj
      )
      await userController.addProfileToUser(foundUser, createdProfile)
    }

    req.flash('success', 'Successfully updated user profile')
    res.redirect('/admin/db/users')
  } catch (err) {
    next(err || new Error('Internal Server Error'))
  }
})

router.get(
  '/users/:userId/edit',
  middleware.isLoggedIn,
  async (req, res, next) => {
    const userId = req.params.userId || ''
    res.locals.flashUrl =
      req.headers.referrer || '/admin/db/users/' + userId + '/edit'
    if (!userId || !validator.isMongoId(userId)) {
      return errorHandler.errorResponse('INVALID_FIELD', 'user Id', next, true)
    }

    try {
      let foundUser = await userController.findUserByUserId(userId)
      if (!foundUser) {
        return errorHandler.errorResponse('NOT_FOUND', 'user', next, true)
      }

      foundUser = await userController.populateFieldsInUsers(foundUser, [
        'profile.batch'
      ])

      let profile = foundUser.profile
      let userBatch
      if (profile) {
        userBatch = profile.batch
      }

      let foundBatches = await batchController.findAllBatch()
      foundBatches = await batchController.populateFieldsInBatches(
        foundBatches,
        ['addedBy']
      )

      return res.render('editUser', {
        foundUser,
        profile,
        userBatch,
        foundBatches
      })
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.delete(
  '/users/:userId',
  middleware.isLoggedIn,
  async (req, res, next) => {
    const userId = req.params.userId || ''
    if (!userId || !validator.isMongoId(userId)) {
      return errorHandler.errorResponse('INVALID_FIELD', 'user Id', next)
    }

    try {
      let foundUser = await userController.findUserByUserId(userId)
      if (!foundUser) {
        return errorHandler.errorResponse('NOT_FOUND', 'user', next)
      }

      foundUser = await userController.populateFieldsInUsers(foundUser, [
        'profile',
        'profile.results',
        'profile.progresses'
      ])

      const profile = foundUser.profile
      if (profile) {
        const results = foundUser.profile.results
        const progresses = foundUser.profile.progresses
        if (results) _.forEach(results, result => result.remove())
        if (progresses) _.forEach(progresses, progress => progress.remove())
        profile.remove()
      }

      foundUser.remove()

      return res.sendStatus(200)
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.get('/files', middleware.isLoggedIn, async (req, res, next) => {
  try {
    const foundFiles = await fileController.findAllFiles()
    const populatedFiles = await fileController.populateFieldsInFiles(
      foundFiles,
      ['class', 'subject', 'chapter', 'topic']
    )
    return res.render('fileDb', {
      files: populatedFiles
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get(
  '/visitors',
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    try {
      const foundVisitors = await visitorController.findAllVisitors()
      console.log('visitors', foundVisitors)
      res.render('visitorDb', {
        visitors: foundVisitors
      })
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.get(
  '/gallery/upload',
  middleware.isLoggedIn,
  middleware.isCentre,
  (req, res, next) => {
    res.render('insertGallery')
  }
)

router.get(
  '/gallery/all/:category',
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    let categoryToDelete = req.params.category

    try {
      await galleryController.deleteCategory(categoryToDelete)
      req.flash(
        'success',
        'successfully deleted all items from current category'
      )
      return res.redirect('/admin/db/gallery')
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.get(
  '/gallery/:imageId/delete',
  middleware.isLoggedIn,
  async (req, res, next) => {
    let imageIdToDelete = req.params.imageId
    if (!imageIdToDelete || !validator.isMongoId(imageIdToDelete)) {
      return errorHandler.errorResponse('INVALID_FIELD', 'Image id', next)
    }

    try {
      const deletedImage = galleryController.deleteImageById(imageIdToDelete)
      if (!deletedImage) {
        req.flash('error', 'Item not found')
        return res.redirect('/admin/db/gallery')
      }
      req.flash('success', 'Image deleted successfully')
      res.redirect('/admin/db/gallery')
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.get('/gallery/all', async (req, res, next) => {
  try {
    const foundImages = await galleryController.findAllImages()
    res.json({
      images: foundImages
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get(
  '/gallery',
  middleware.isLoggedIn,
  middleware.isCentre,
  (req, res, next) => {
    res.render('galleryDb')
  }
)

router.post(
  '/gallery',
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    if (!req.files.userFile) {
      return errorHandler.errorResponse('INVALID_FIELD', 'image', next)
    }
    const filePath = path.join(
      GALLERY_DIR,
      Date.now() + '__' + req.files.userFile.name
    )
    try {
      await fileController.uploadFileToDirectory(filePath, req.files.userFile)
    } catch (err) {
      return next(err || 'Internal Server Error')
    }
    var fileName = req.files.userFile.name

    // absolute file path
    var srcList = filePath.split(path.sep)

    // relative file path (required by ejs file)
    var src = path.join(
      '/',
      srcList[srcList.length - 2],
      srcList[srcList.length - 1]
    )

    var uploadDate = moment(Date.now())
      .tz('Asia/Kolkata')
      .format('MMMM Do YYYY, h:mm:ss a')
    var description = req.body.description
    var category = req.body.category
    var thumbPath = path.join(
      '/',
      srcList[srcList.length - 2],
      'thumb',
      srcList[srcList.length - 1]
    )

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
      next(err || 'Internal Server Error')
    }
  }
)

module.exports = router

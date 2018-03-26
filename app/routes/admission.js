const express = require('express'),
  path = require('path'),
  validator = require('validator'),
  router = express.Router(),
  courseController = require('./../controllers/courses.controller'),
  admissionController = require('./../controllers/admission.controller'),
  fileController = require('./../controllers/file.controller'),
  errorHandler = require('../errorHandler'),
  middleware = require('../middleware')

const PROFILE_IMG_DIR = path.join(__dirname, '/../../../HarvinDb/profileImg/')

router.get('/new', middleware.isLoggedIn, async (req, res, next) => {
  try {
    let allCourses = await courseController.findAllCourses()
    res.render('newAdmission', { courses: allCourses })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/', middleware.isLoggedIn, async (req, res, next) => {
  try {
    let foundAdmissons = await admissionController.findAllAdmissions()
    res.render('admissionsDb', { admissions: foundAdmissons })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.delete(
  '/:admissionId',
  middleware.isLoggedIn,
  async (req, res, next) => {
    const admissionId = req.params.admissionId || ''
    if (!admissionId || !validator.isMongoId(admissionId)) {
      return errorHandler.errorResponse('INVALID_FIELD', 'admission id', next)
    }

    try {
      let foundAdmisson = await admissionController.findAdmissionById(
        admissionId
      )

      if (!foundAdmisson) {
        return errorHandler.errorResponse('NOT_FOUND', 'admission form', next)
      } else {
        foundAdmisson.remove()
      }
      res.sendStatus(200)
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.get(
  '/view/:admissionId',
  middleware.isLoggedIn,
  async (req, res, next) => {
    const admissionId = req.params.admissionId || ''
    if (!admissionId || !validator.isMongoId(admissionId)) {
      return errorHandler.errorResponse('INVALID_FIELD', 'admission id', next)
    }

    try {
      let allCourses = await courseController.findAllCourses()

      let foundAdmisson = await admissionController.findAdmissionById(
        admissionId
      )
      res.render('viewAdmissionForm', {
        admission: foundAdmisson,
        courses: allCourses
      })
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.post(
  '/edit/:admissionId',
  middleware.isLoggedIn,
  async (req, res, next) => {
    const admissionId = req.params.admissionId || ''
    if (!admissionId || !validator.isMongoId(admissionId)) {
      return errorHandler.errorResponse('INVALID_FIELD', 'admission id', next)
    }
    res.locals.flashUrl = req.header.referer || '/admin/admissions'
    const date = Date.now()
    try {
      req.body.date = date
      await admissionController.updateAdmissionById(admissionId, req.body)
      req.flash('success', 'Form has been successfully updated!!!')
      res.redirect(res.locals.flashUrl)
    } catch (err) {
      next(err || 'Internal Server Error')
    }
  }
)

router.post('/', middleware.isLoggedIn, async (req, res, next) => {
  if (!req.files.profileImg) {
    return errorHandler.errorResponse('INVALID_FIELD', 'profile image', next)
  }
  res.locals.flashUrl = req.header.referer || '/admin/admissions/new'
  const date = Date.now()
  const filePath = path.join(
    PROFILE_IMG_DIR,
    date + '__' + req.files.profileImg.name
  )
  const profileImg = path.basename(filePath)
  try {
    await fileController.uploadFileToDirectory(filePath, req.files.profileImg)
    req.body.profileImg = profileImg
    req.body.date = date
    await admissionController.newAdmission(req.body)
    req.flash('success', 'Form has been successfully submitted!!!')
    res.redirect(res.locals.flashUrl)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})
module.exports = router

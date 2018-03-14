const express = require('express')
const path = require('path')
const validator = require('validator')
const router = express.Router()
const courseController = require('./../controllers/courses.controller')
const admissionController = require('./../controllers/admission.controller')
const fileController = require('./../controllers/file.controller')
const errorHandler = require('../errorHandler')

const PROFILE_IMG_DIR = path.join(__dirname, '/../../../HarvinDb/profileImg/')

router.get('/new', async (req, res, next) => {
  try {
    let allCourses = await courseController.findAllCourses()
    res.render('newAdmission', { courses: allCourses })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/', async (req, res, next) => {
  try {
    let foundAdmissons = await admissionController.findAllAdmissions()
    res.render('admissionsDb', { admissions: foundAdmissons })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/view/:admissionId', async (req, res, next) => {
  const admissionId = req.params.admissionId || ''
  if (!admissionId || !validator.isMongoId(admissionId)) { return errorHandler.errorResponse('INVALID_FIELD', 'admission id', next) }

  try {
    let foundAdmisson = await admissionController.findAdmissionById(
      admissionId
    )
    res.render('viewAdmissionForm', { admission: foundAdmisson })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.post('/', async (req, res, next) => {
  console.log('body', req.body)
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

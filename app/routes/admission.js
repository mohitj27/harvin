const express = require('express')
const path = require('path')
const router = express.Router()
const courseController = require('./../controllers/courses.controller')
const admissionController = require('./../controllers/admission.controller')
const fileController = require('./../controllers/file.controller')
const errorHandler = require('../errorHandler')

const PROFILE_IMG_DIR = path.join(__dirname, '/../../../HarvinDb/profileImg/')


router.get('/', async (req, res, next) => {
  try {
    let allCourses = await courseController.findAllCourses()
    res.render('newAdmission1', { courses: allCourses })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.post('/', async (req, res, next) => {
  // console.log('boyd', req.body)
  res.locals.flashUrl = req.header.referer || '/admin/admission'
  const filePath = path.join(PROFILE_IMG_DIR, Date.now() + '__' + req.files.profileImg.name)
  const profileImg = path.basename(filePath)
  try {
    await fileController.uploadFileToDirectory(filePath, req.files.profileImg)
    req.body.profileImg = profileImg
    await admissionController.newAdmission(req.body)
    req.flash('success', 'Form has been successfully submitted!!!')
    res.redirect(res.locals.flashUrl)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})
module.exports = router

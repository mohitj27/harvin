const express = require('express')
const router = express.Router()
const courseController = require('./../controllers/courses.controller')
const errorHandler = require('../errorHandler')

router.get('/', async (req, res, next) => {
  try {
    let allCourses = await courseController.findAllCourses()
    res.render('newAdmission1', { courses: allCourses })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

module.exports = router

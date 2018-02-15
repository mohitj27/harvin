const express = require('express'),
  router = express.Router(),
  FIOCont = require('../controllers/fileRW.controller')
coursesCont = require('../controllers/courses.controller'),
  path = require('path')
COURSEIMAGE_SAVE_LOCATION = path.normalize(__dirname + '/../../../HarvinDb/courseImages/');


router.get('/new', (req, res) => {


  res.render('newCourse')
})

router.get('/all', (req, res) => {

  res.render('allCourses')
})

router.post('/',  (req, res, next) => {

  FIOCont.fileWriteMulterPromise(COURSEIMAGE_SAVE_LOCATION, 'courseImage').then((upload)=>{
    upload(req, res,   (err) => {
      if (err) next(err)
      const courseName = req.body.courseName,
        courseImage = req.body.courseImage,
        courseTimings = req.body.classTimings,
        courseStartingFrom = req.body.courseStartingFrom,
        courseDescription = req.body.courseDescription,
        courseFor = req.body.courseFor,
        courseAdmissionThrough = req.body.courseAdmissionThrough,
        courseFrequency = req.body.courseFrequency
      const course = {
        courseName,
        courseImage,
        courseTimings,
        courseStartingFrom,
        courseDescription,
        courseFor,
        courseAdmissionThrough,
        courseFrequency
      }
      coursesCont.insertInCourse(course).then((result)=>{
        if(result){

            req.flash("success", 'Course Inserted Successfully')
            res.redirect("/admin/courses/all")
        }
      }).catch(err=>next(err))

    })
  }).catch(err=>next(err))



})
module.exports = router

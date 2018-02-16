const express = require('express'),
  router = express.Router(),
  FIOCont = require('../controllers/fileRW.controller')
coursesCont = require('../controllers/courses.controller'),
  path = require('path')
COURSEIMAGE_SAVE_LOCATION = path.normalize(__dirname + '/../../../HarvinDb/courseImages/');


router.get('/new', (req, res) => {


  res.render('newCourse')
})

router.get('/all', async (req, res) => {
  try{
    const foundCourses= await coursesCont.findAllCourses()
    res.render('coursesList',{foundCourses})
  }catch(err){next(err)}

})

router.post('/', (req, res, next) => {

  FIOCont.fileWriteMulterPromise(COURSEIMAGE_SAVE_LOCATION, 'courseImage').then((upload) => {
    upload(req, res, (err) => {
      if (err) next(err)
      console.log(req.file)
      const courseName = req.body.courseName,
        courseImage = req.file.originalname,
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
      coursesCont.insertInCourse(course).then((result) => {
        if (result) {

          req.flash("success", 'Course Inserted Successfully')
          res.redirect("/admin/courses/all")
        }
      }).catch(err => next(err))

    })
  }).catch(err => next(err))



})
router.delete('/delete/:courseName',(req,res,next)=>{
  try {
const courseName=coursesCont.deleteOneCourse(req.params.courseName)
res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})
module.exports = router

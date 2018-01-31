var express = require("express"),
  errors = require("../error"),
  middleware = require("../middleware"),
  Center = require('./../models/Center'),
  Assignment = require('./../models/Assignment'),
  Exam = require('./../models/Exam'),
  router = express.Router();

router.get('/all', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  res.render('allCenters')
});

router.get('/:centerName', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  let centerName = req.params.centerName;
  Center.findOne({
      centerName
    })
    .exec((err, foundCenter) => {
      if (err) {
        console.log('err', err);
        next(new errors.generic())
      } else if (!foundCenter) {
        res.render('notFound')
      } else {
        res.render('centerView', {
          foundCenter
        });
      }
    })
})

router.get('/:centerName/exams', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  let centerName = req.params.centerName;
  Center.findOne({
    centerName
  }, (err, foundCenter) => {
    if (err) {
      console.log('err', err);
      next(new errors.generic())
    } else if (!foundCenter) {
      res.render('notFound');
    } else {

      Exam.find({
        atCenter: foundCenter._id
      }, (err, foundExams) => {
        if (err) {
          console.log('err', err);
          return next(new errors.generic())
        } else {
          res.render('exams', {
            foundExams
          })
        }
      })

    }
  })

})

router.get('/:centerName/assignments', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  let centerName = req.params.centerName;
  Center.findOne({
    centerName
  }, (err, foundCenter) => {
    if (err) {
      console.log('err', err);
      next(new errors.generic())
    } else if (!foundCenter) {
      res.render('notFound');
    } else {

      Assignment.find({
        atCenter: foundCenter._id
      }, (err, foundExams) => {
        if (err) {
          console.log('err', err);
          return next(new errors.generic())
        } else {
          res.render('exams', {
            foundExams
          })
        }
      })

    }
  })

})

router.get('/:centerName/batches', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  let centerName = req.params.centerName;
  Assignment.find({
    atCenter: req.user._id
  }, (err, foundAssignments) => {
    if (err) {
      console.log('err', err);
      return next(new errors.generic())
    } else {
      res.render('assignments', {
        foundAssignments
      })
    }
  })

})

module.exports = router

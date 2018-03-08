const express = require('express')
const validator = require('validator')
const errorHandler = require('../errorHandler')
const errors = require('../error')
const middleware = require('../middleware')
const Center = require('./../models/Center')
const Assignment = require('./../models/Assignment')
const userController = require('../controllers/user.controller')
const profileController = require('../controllers/profile.controller')
const instituteController = require('../controllers/institute.controller')
const Exam = require('./../models/Exam')
const router = express.Router()

router.get('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    let centersOfInstituteOfCurrentCenter = await userController.centersOfInstituteOfCenter(req.user)

    res.render('allCenters', {
      centers: centersOfInstituteOfCurrentCenter
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  res.render('newCenter')
})

router.delete('/:centerId', async (req, res, next) => {
  let centerId = req.params.centerId || ''
  if (!centerId || !validator.isMongoId(centerId)) return errorHandler.errorResponse('INVALID_FIELD', 'center id', next)

  let foundCenter = await userController.findUserByUserId(centerId)
  foundCenter = await userController.populateFieldsInUsers(foundCenter, ['profile'])

  let foundCenterInstitute = await userController.instituteOfCurrentCenter(foundCenter)
  await instituteController.removeCenterFromInstituteById(foundCenterInstitute, foundCenter)

  foundCenter.profile.remove()
  foundCenter.remove()

  return res.sendStatus(200)
})

router.post('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  const centerName = req.body.centerName || ''
  const username = req.body.username || ''
  const password = req.body.password || ''
  const role = 'centre'

  res.locals.flashUrl = '/admin/centers/new'

  if (!centerName || validator.isEmpty(centerName)) return errorHandler.errorResponse('INVALID_FIELD', 'Center name', next)
  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'center name', next)
  if (!password || validator.isEmpty(password)) return errorHandler.errorResponse('INVALID_FIELD', 'password', next)
  if (!role || role.length <= 0) return errorHandler.errorResponse('INVALID_FIELD', 'role', next)

  try {
    let curretnCenterInstitute = await userController.instituteOfCurrentCenter(req.user)
    let registerdUser = await userController.registerUser({
      username,
      password,
      role
    })

    let updatedInstitute = await instituteController.updateFieldsInInstituteById(curretnCenterInstitute, {
      centers: registerdUser
    })

    let createdProfile = await profileController.createNewProfile({
      fullName: centerName,
      isCenterOfInstitute: updatedInstitute
    })

    await userController.updateFieldsInUserById(registerdUser, {}, {
      profile: createdProfile
    })

    req.flash('success', 'Successfully added new center')
    res.redirect('/admin/centers')
  } catch (e) {
    e = e.toString()
    if (e.indexOf('registered') !== -1) return next('A center with same name is already registered')
    next(e || 'Internal Server Error')
  }
})

router.get('/:centerName', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  let centerName = req.params.centerName
  Center.findOne({
    centerName
  })
    .exec((err, foundCenter) => {
      if (err) {
        console.log('err', err)
        next(new errors.generic())
      } else if (!foundCenter) {
        res.render('notFound')
      } else {
        res.render('centerView', {
          foundCenter
        })
      }
    })
})

router.get('/:centerName/exams', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  let centerName = req.params.centerName
  Center.findOne({
    centerName
  }, (err, foundCenter) => {
    if (err) {
      console.log('err', err)
      next(new errors.generic())
    } else if (!foundCenter) {
      res.render('notFound')
    } else {
      Exam.find({
        atCenter: foundCenter._id
      }, (err, foundExams) => {
        if (err) {
          console.log('err', err)
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
  let centerName = req.params.centerName
  Center.findOne({
    centerName
  }, (err, foundCenter) => {
    if (err) {
      console.log('err', err)
      next(new errors.generic())
    } else if (!foundCenter) {
      res.render('notFound')
    } else {
      Assignment.find({
        atCenter: foundCenter._id
      }, (err, foundExams) => {
        if (err) {
          console.log('err', err)
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
  let centerName = req.params.centerName
  Assignment.find({
    atCenter: req.user._id
  }, (err, foundAssignments) => {
    if (err) {
      console.log('err', err)
      return next(new errors.generic())
    } else {
      res.render('assignments', {
        foundAssignments
      })
    }
  })
})

module.exports = router

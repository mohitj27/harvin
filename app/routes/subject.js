const express = require('express')
const validator = require('validator')
const subjectController = require('../controllers/subject.controller')
const classController = require('../controllers/class.controller')
const router = express.Router()
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')

router.get('/new', middleware.isLoggedIn, (req, res, next) => {
  res.render('newSubject')
})

router.post('/', middleware.isLoggedIn, async (req, res, next) => {
  const user = req.user
  res.locals.flashUrl = req.originalUrl

  const subjectName = req.body.subjectName || ''
  const className = req.body.className || ''

  if (!className || validator.isEmpty(className)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)
  }
  if (!subjectName || validator.isEmpty(subjectName)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
  }

  const newSubject = {
    subjectName
  }

  const newClass = {
    className
  }

  try {
    let updatedClass = await classController.createOrUpdateNewClass(
      newClass,
      user
    )
    let updatedSubject = await subjectController.createOrUpdateNewSubject(
      newSubject,
      user,
      updatedClass
    )
    updatedClass = await classController.addSubjectToClassByClassNameAndUserId(
      newClass,
      user,
      updatedSubject
    )

    req.flash('success', 'Subject Added Successfully')
    res.redirect('/admin/subjects/new')
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

// helper- subject
router.get('/:subjectName', middleware.isLoggedIn, async function (
  req,
  res,
  next
) {
  const subjectName = req.params.subjectName
  const className = req.query.className

  try {
    const foundSubject = await subjectController.findSubjectBySubjectClassAndUserId(
      subjectName,
      className,
      req.user
    )
    foundSubject.populate('chapters', (err, foundSubject) => {
      if (err) return next(err || 'Internal Server Error')
      else {
        return res.json({
          subject: foundSubject
        })
      }
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

module.exports = router

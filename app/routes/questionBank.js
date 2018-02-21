const express = require('express')
const QbController = require('../controllers/QB.controller')
const errorHandler = require('../errorHandler/index')
const middleware = require('../middleware')
const validator = require('validator')
const router = express.Router()

router.get('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    const foundClasses = await QbController.findAllQbClassesByUserId(req.user)
    res.render('questionBank', {
      classes: foundClasses,
      questions: {}
    })
  } catch (err) {
    next(err)
  }
})

router.get('/addNew', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  res.render('quesBankAddNew')
})

router.get('/qbData', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  res.locals.flashUrl = req.headers.referer

  const className = req.query.className || ''
  const subjectName = req.query.subjectName || ''
  const chapterName = req.query.chapterName || ''

  if (!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)
  if (!subjectName || validator.isEmpty(subjectName)) return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
  if (!chapterName || validator.isEmpty(chapterName)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter name', next)

  try {
    let foundClass = await QbController.findQbClassByClassNameAndUserId(className, req.user)
    foundClass = await QbController.populateFieldsInQbClasses(foundClass, ['subjects.chapters.questions'])
    let questions
    if (foundClass) {
      const subject = foundClass.subjects.find(item => item.subjectName === subjectName)
      if (subject) {
        const chapter = subject.chapters.find(item => item.chapterName === chapterName)
        if (chapter) {
          questions = chapter.questions
        }
      }
    }
    let foundClasses = await QbController.findAllQbClassesByUserId(req.user)
    return res.render('questionBank', {
      classes: foundClasses,
      questions: questions || [],
      className: className,
      subjectName: subjectName,
      chapterName: chapterName
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  res.locals.flashUrl = req.headers.referer

  var optionString = req.body.options || ''
  var answerString = req.body.answer || ''
  var question = req.body.question || ''

  const className = req.body.className || ''
  const subjectName = req.body.subjectName || ''
  const chapterName = req.body.chapterName || ''

  if (!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)
  if (!subjectName || validator.isEmpty(subjectName)) return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
  if (!chapterName || validator.isEmpty(chapterName)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter name', next)
  if (!question || validator.isEmpty(question)) return errorHandler.errorResponse('INVALID_FIELD', 'question', next)

  let newQues = await QbController.createNewQuestionObj(optionString, answerString, question, req.user)

  try {
    // create new Question
    let createdQuestion = await QbController.createQuestion(newQues)

    // add this question to question bank also
    let updatedChapter = await QbController.createOrUpdateQuestionInQBChapterByName(chapterName, createdQuestion, req.user)
    let updatedSubject = await QbController.createOrUpdateChapterInQBSubjectBySubjectAndClassName(subjectName, className, updatedChapter, req.user)
    await QbController.createOrUpdateSubjectInQBClassByName(className, updatedSubject, req.user)

    req.flash('success', 'Question has been added Successfully')
    return res.redirect(req.headers.referer)
  } catch (e) {
    return next(e)
  }
})

router.get('/classes', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    let foundClasses = await QbController.findAllQbClassesByUserId(req.user)
    res.json({
      classes: foundClasses
    })
  } catch (err) {
    next(err)
  }
})

router.get('/class/:className', async (req, res, next) => {
  let className = req.params.className || ''
  if (!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)

  try {
    let foundClass = await QbController.findQbClassByClassNameAndUserId(className, req.user)
    foundClass = await QbController.populateFieldsInQbClasses(foundClass, ['subjects'])
    res.json({
      classs: foundClass
    })
  } catch (err) {
    next(err)
  }
})

// helper- subject
router.get('/subject/:subjectName', async (req, res, next) => {
  const subjectName = req.params.subjectName
  const className = req.query.className

  if (!subjectName || validator.isEmpty(subjectName)) return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
  if (!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)

  try {
    let foundSubject = await QbController.findSubjectBySubjectClassAndUserId(subjectName, className, req.user)
    foundSubject = await QbController.populateFieldsInQbSubjects(foundSubject, ['chapters'])
    return res.json({
      subject: foundSubject
    })
  } catch (e) {
    next(e)
  }
})

// helper-chapter
router.get('/chapter/:chapterName', async (req, res, next) => {
  const chapterName = req.params.chapterName
  if (!chapterName || validator.isEmpty(chapterName)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter name', next)

  try {
    let foundChapter = await QbController.findQbChapterByChapterNameAndUserId(chapterName, req.user)
    foundChapter = await QbController.populateFieldsInQbChapters(foundChapter, ['topics'])
    res.json({
      chapter: foundChapter
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/:questionId', async (req, res, next) => {
  const questionId = req.params.questionId || ''
  if (!validator.isMongoId(questionId)) return errorHandler.errorResponse('INVALID_FIELD', 'question id', next)
  try {
    var deletedQuestion = await QbController.deleteQuestionById(req.params.questionId)
  } catch (e) {
    return next(e)
  }

  if (deletedQuestion) {
    res.json({
      success: true,
      msg: 'Question has been deleted successfully'
    })
  } else {
    res.json({
      success: false,
      msg: 'Question not found'
    })
  }
})

module.exports = router

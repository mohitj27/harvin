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

router.get('/update', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  res.render('qbUpdate')
})

const updateSubject = function (subId, classId) {
  return new Promise(async function (resolve, reject) {
    try {
      let foundSubject = await QbController.findSubjectById(subId)
      let foundClass = await QbController.findClassById(classId)
      let updatedSubject = await QbController.updateSubjectById(foundSubject, {}, {
        class: foundClass
      })
      let updatedClass = await QbController.removeSubjectFromClassById(foundClass, foundSubject)
      // refactor
      foundSubject = await QbController.populateFieldsInQbSubjects(foundSubject, ['chapters.questions'])
      let chapters = foundSubject.chapters
      for (let chapter of chapters) {
        await QbController.updateChapterById(chapter, {}, {
          foundSubject
        })
        let questions = chapter.questions
        for (let ques of questions) {
          await QbController.updateQuestionById(ques, {}, {
            class: updatedClass,
            subject: updatedSubject,
            chapter
          })
        }
      }

      resolve(updatedSubject)
    } catch (err) {
      reject(err)
    }
  })
}

const updateChapter = function (chapterId, subId) {
  return new Promise(async function (resolve, reject) {
    try {
      let foundChapter = await QbController.findChapterById(chapterId)
      let foundSubject = await QbController.findSubjectById(subId)
      let updatedChapter = await QbController.updateChapterById(foundChapter, {}, {
        subject: foundSubject
      })
      let updatedSubject = await QbController.removeChapterFromSubjectById(foundSubject, foundChapter)
      // refactor
      foundChapter = await QbController.populateFieldsInQbChapters(foundChapter, ['questions'])
      let questions = foundChapter.questions

      for (let ques of questions) {
        let upQ = await QbController.updateQuestionById(ques, {}, {
          chapter: updatedChapter,
          subject: updatedSubject
        })
      }

      resolve(updatedChapter)
    } catch (err) {
      reject(err)
    }
  })
}

router.post('/update', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  let {
    subId,
    chapterId,
    classId,
    toUpdate
  } = req.body
  if (!toUpdate || validator.isEmpty(toUpdate)) return errorHandler.errorResponse('INVALID_FIELD', 'field to update', next)
  if (toUpdate === 'subject') {
    if (!subId || !validator.isMongoId(subId)) return errorHandler.errorResponse('INVALID_FIELD', 'subject id', next)
    if (!classId || !validator.isMongoId(classId)) return errorHandler.errorResponse('INVALID_FIELD', 'class id', next)
  } else {
    if (!subId || !validator.isMongoId(subId)) return errorHandler.errorResponse('INVALID_FIELD', 'subject id', next)
    if (!chapterId || !validator.isMongoId(chapterId)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter id', next)
  }

  try {
    switch (toUpdate) {
      case 'subject':
        await updateSubject(subId, classId)
        break
      case 'chapter':
        await updateChapter(chapterId, subId)
        break
      default:
        return errorHandler.errorResponse('INVALID_FIELD', 'field to update', next)
    }
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

router.get('/refactor', async (req, res, next) => {
  try {
    let foundClasses = await QbController.findAllQbClasses()
    foundClasses = await QbController.populateFieldsInQbClasses(foundClasses, ['subjects.chapters.questions'])
    for (let classs of foundClasses) {
      let subjects = classs.subjects
      for (let subject of subjects) {
        await QbController.updateSubjectById(subject, {}, {
          class: classs
        })
        let chapters = subject.chapters
        for (let chapter of chapters) {
          await QbController.updateChapterById(chapter, {}, {
            subject
          })
          let questions = chapter.questions
          for (let ques of questions) {
            await QbController.updateQuestionById(ques, {}, {
              class: classs,
              subject,
              chapter
            })
          }
        }
      }
    }
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

router.post('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  var optionString = req.body['option[]'] || ''
  var answerString = req.body['answer[]'] || ''
  var question = req.body.question || ''

  const className = req.body.className || ''
  const subjectName = req.body.subjectName || ''
  const chapterName = req.body.chapterName || ''

  if (!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)
  if (!subjectName || validator.isEmpty(subjectName)) return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
  if (!chapterName || validator.isEmpty(chapterName)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter name', next)
  if (!question || validator.isEmpty(question)) return errorHandler.errorResponse('INVALID_FIELD', 'question', next)

  let newQues = await QbController.createNewQuestionObj(optionString, answerString, question, req.user)
  if (newQues.options.length < 1) return errorHandler.errorResponse('INVALID_FIELD', 'options', next)
  if (newQues.answers.length < 1) return errorHandler.errorResponse('INVALID_FIELD', 'answers', next)

  try {
    // create new Question
    let createdQuestion = await QbController.createQuestion(newQues)

    // add this question to question bank also
    let updatedChapter = await QbController.createOrUpdateQuestionInQBChapterByName(chapterName, createdQuestion, req.user)
    let updatedSubject = await QbController.createOrUpdateChapterInQBSubjectBySubjectAndClassName(subjectName, className, updatedChapter, req.user)
    let updatedClass = await QbController.createOrUpdateSubjectInQBClassByName(className, updatedSubject, req.user)
    updatedChapter = await QbController.updateChapterById(updatedChapter, {}, {
      subject: updatedSubject
    })
    updatedSubject = await QbController.updateSubjectById(updatedSubject, {}, {
      class: updatedClass
    })

    return res.sendStatus(200)
  } catch (e) {
    return next(e)
  }
})

router.get('/subjectId/:subId', async (req, res, next) => {
  let subId = req.params.subId || ''
  if (!subId || !validator.isMongoId(subId)) return errorHandler.errorResponse('INVALID_FIELD', 'subject id', next)
  try {
    let foundSubject = await QbController.findSubjectById(subId)
    foundSubject = await QbController.populateFieldsInQbSubjects(foundSubject, ['class'])
    let foundClass = foundSubject.class
    let foundClasses = await QbController.findAllQbClasses()
    res.json({
      classs: foundClass,
      classes: foundClasses
    })
  } catch (err) {
    next(err)
  }
})

router.get('/chapterId/:chapId', async (req, res, next) => {
  let chapId = req.params.chapId || ''
  if (!chapId || !validator.isMongoId(chapId)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter id', next)
  try {
    let foundChapter = await QbController.findChapterById(chapId)
    foundChapter = await QbController.populateFieldsInQbChapters(foundChapter, ['subject'])
    let foundSubject = foundChapter.subject
    let foundSubjects = await QbController.findAllQbSubjects()
    res.json({
      subject: foundSubject,
      subjects: foundSubjects
    })
  } catch (err) {
    next(err)
  }
})

router.get('/subjects', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    let foundSubjects = await QbController.findAllQbSubjectsByUserId(req.user)
    res.json({
      subjects: foundSubjects
    })
  } catch (err) {
    next(err)
  }
})

router.get('/chapters', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    let foundChapters = await QbController.findAllQbChaptersByUserId(req.user)
    res.json({
      chapters: foundChapters
    })
  } catch (err) {
    next(err)
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

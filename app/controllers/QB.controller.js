const errorHandler = require('../errorHandler')
const Question = require('./../models/Question')
const QuestionPaper = require('./../models/QuestionPaper')
const Exam = require('./../models/Exam')
const QB_Class = require('../models/QB_Class')
const QB_Subject = require('../models/QB_Subject')
const QB_Chapter = require('../models/QB_Chapter')
const Result = require('./../models/Result')
const _ = require('lodash')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const deleteQuestionById = function (questionId) {
  return new Promise(function (resolve, reject) {
    Question.findByIdAndRemove(questionId, function (err, deletedQuestion) {
      if (err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(deletedQuestion)
    })
  })
}

const populateFieldsInQbClasses = function (qbClasses, path) {
  return new Promise(function (resolve, reject) {
    QB_Class
      .deepPopulate(qbClasses, path)
      .then(populatedQbClasses => resolve(populatedQbClasses))
      .catch(err => reject(err))
  })
}

const findQbClassByClassNameAndUserId = function (className, user) {
  return new Promise(function (resolve, reject) {
    QB_Class.findOneAsync({
      className,
      addedBy: user
    })
      .then(foundClass => resolve(foundClass))
      .catch(err => reject(err))
  })
}

const findSubjectBySubjectClassAndUserId = function (subjectName, className, user) {
  return new Promise(function (resolve, reject) {
    QB_Subject.findOneAsync({
      subjectName,
      className,
      addedBy: user
    })
      .then(foundSubject => resolve(foundSubject))
      .catch(err => reject(err))
  })
}

const findQbChapterByChapterNameAndUserId = function (chapterName, user) {
  return new Promise(function (resolve, reject) {
    QB_Chapter.findOneAsync({
      chapterName,
      addedBy: user
    })
      .then(foundChapter => resolve(foundChapter))
      .catch(err => reject(err))
  })
}

const findAllQbClassesByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    QB_Class.findAsync({
      addedBy: user
    })
      .then(foundClasses => resolve(foundClasses))
      .catch(err => reject(err))
  })
}

const findAllQbClasses = function () {
  return new Promise(function (resolve, reject) {
    QB_Class.findAsync()
      .then(foundClasses => resolve(foundClasses))
      .catch(err => reject(err))
  })
}

const populateFieldsInQuestionPapers = function (questionPapers, field) {
  return new Promise(function (resolve, reject) {
    QuestionPaper
      .deepPopulate(questionPapers, field)
      .then(populatedQuestionPapers => resolve(populatedQuestionPapers))
      .catch(err => resolve(err))
  })
}

const findAllQuestionsByIds = function (questionIds) {
  return new Promise(function (resolve, reject) {
    Question
      .findAsync({
        _id: {
          $in: questionIds
        }
      })
      .then(foundQuestions => resolve(foundQuestions))
      .catch(err => resolve(err))
  })
}

const createQuestion = function (newQues) {
  return new Promise(function (resolve, reject) {
    Question
      .createAsync(newQues)
      .then(createdQuestion => resolve(createdQuestion))
      .catch(err => resolve(err))
  })
}

const addQuestionToQuestionPaperById = function (questionPaperId, question) {
  return new Promise(function (resolve, reject) {
    QuestionPaper
      .findByIdAndUpdateAsync(questionPaperId, {
        $addToSet: {
          questions: question
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(createdQuestionPaper => resolve(createdQuestionPaper))
      .catch(err => resolve(err))
  })
}

const addQuestionsToQuestionPaperById = function (questionPaperId, questions) {
  return new Promise(function (resolve, reject) {
    QuestionPaper
      .findByIdAndUpdateAsync(questionPaperId, {
        $addToSet: {
          questions: {
            $each: questions
          }
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(createdQuestionPaper => resolve(createdQuestionPaper))
      .catch(err => resolve(err))
  })
}

const addQuestionPaperToExamById = function (examId, questionPaper) {
  return new Promise(function (resolve, reject) {
    Exam
      .findByIdAndUpdateAsync(examId, {
        $set: {
          questionPaper
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(updatedExam => resolve(updatedExam))
      .catch(err => resolve(err))
  })
}

const createOrUpdateQuestionInQBChapterByName = function (chapterName, question, user) {
  return new Promise(function (resolve, reject) {
    QB_Chapter
      .findOneAndUpdateAsync({
        chapterName,
        addedBy: user
      }, {
        $addToSet: {
          questions: question
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(updatedChapter => resolve(updatedChapter))
      .catch(err => resolve(err))
  })
}

const createOrUpdateChapterInQBSubjectBySubjectAndClassName = function (subjectName, className, chapter, user) {
  return new Promise(function (resolve, reject) {
    QB_Subject
      .findOneAndUpdateAsync({
        subjectName,
        className,
        addedBy: user
      }, {
        $addToSet: {
          chapters: chapter
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(updatedSubject => resolve(updatedSubject))
      .catch(err => resolve(err))
  })
}

const createOrUpdateSubjectInQBClassByName = function (className, subject, user) {
  return new Promise(function (resolve, reject) {
    QB_Class
      .findOneAndUpdateAsync({
        className,
        addedBy: user
      }, {
        $addToSet: {
          subjects: subject
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
      .then(updatedClass => resolve(updatedClass))
      .catch(err => resolve(err))
  })
}

const createQuestionPaper = function (newQuestionPaper) {
  return new Promise(function (resolve, reject) {
    QuestionPaper
      .create(newQuestionPaper)
      .then(createdQuestionPaper => resolve(createdQuestionPaper))
      .catch(err => resolve(err))
  })
}

const createNewQuestionObj = function (options, answers, question, user) {
  return new Promise(function (resolve, reject) {
    options = _.compact(_.castArray(options))
    answers = _.compact(_.castArray(answers))

    // data for new question
    var newQues = {
      question,
      answers,
      options,
      newOptions: [],
      answersIndex: [],
      addedBy: user
    }

    // populate answer index
    newQues.answers.forEach((answer) => {
      newQues.options.forEach((option, optIndex) => {
        if (answer === option) {
          newQues.answersIndex.push(optIndex)
        }
      })
    })

    // populate new options
    newQues.options.forEach((optJ, j) => {
      if (_.indexOf(newQues.answersIndex, j) !== -1) {
        newQues.newOptions.push({
          opt: optJ,
          isAns: true
        })
      } else {
        newQues.newOptions.push({
          opt: optJ,
          isAns: false
        })
      }
    })

    resolve(newQues)
  })
}

const populateFieldsInQbSubjects = function (subjects, path) {
  return new Promise(function (resolve, reject) {
    QB_Subject
      .deepPopulate(subjects, path)
      .then(populatedSubjects => resolve(populatedSubjects))
      .catch(err => reject(err))
  })
}

const populateFieldsInQbChapters = function (chapters, path) {
  return new Promise(function (resolve, reject) {
    QB_Chapter
      .deepPopulate(chapters, path)
      .then(populatedChapters => resolve(populatedChapters))
      .catch(err => reject(err))
  })
}

const createNewResult = function (newResult) {
  return new Promise(function (resolve, reject) {
    Result
      .createAsync(newResult)
      .then(createdResult => resolve(createdResult))
      .catch(err => reject(err))
  })
}

const findAllQbSubjectsByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    QB_Subject
      .findAsync({
        addedBy: user
      })
      .then(foundSubjects => resolve(foundSubjects))
      .catch(err => reject(err))
  })
}

const findAllQbSubjects = function () {
  return new Promise(function (resolve, reject) {
    QB_Subject
      .findAsync()
      .then(foundSubjects => resolve(foundSubjects))
      .catch(err => reject(err))
  })
}

const findAllQbChaptersByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    QB_Chapter
      .findAsync({
        addedBy: user
      })
      .then(foundChapters => resolve(foundChapters))
      .catch(err => reject(err))
  })
}

const findAllQbChapters = function () {
  return new Promise(function (resolve, reject) {
    QB_Chapter
      .findAsync()
      .then(foundChapters => resolve(foundChapters))
      .catch(err => reject(err))
  })
}

const findSubjectById = function (subjectId) {
  return new Promise(function (resolve, reject) {
    QB_Subject
      .findByIdAsync(subjectId)
      .then(foundSubject => resolve(foundSubject))
      .catch(err => reject(err))
  })
}

const findChapterById = function (chapterId) {
  return new Promise(function (resolve, reject) {
    QB_Chapter
      .findByIdAsync(chapterId)
      .then(foundChapter => resolve(foundChapter))
      .catch(err => reject(err))
  })
}

const findClassById = function (classsId) {
  return new Promise(function (resolve, reject) {
    QB_Class
      .findByIdAsync(classsId)
      .then(foundClass => resolve(foundClass))
      .catch(err => reject(err))
  })
}

const removeSubjectFromClassById = (classs, subject) => {
  return new Promise((resolve, reject) => {
    QB_Class.findByIdAndUpdateAsync(classs.id, {
      $pull: {subjects: {_id: subject._id}}
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedClass => resolve(updatedClass))
      .catch(err => reject(err))
  })
}

const removeChapterFromSubjectById = (subject, chapter) => {
  return new Promise((resolve, reject) => {
    QB_Subject.findByIdAndUpdateAsync(subject.id, {
      $pull: {chapters: {_id: chapter._id}}
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedSubject => resolve(updatedSubject))
      .catch(err => reject(err))
  })
}

const updateSubjectById = (subject, addToSetFields, setFields) => {
  if (_.isEmpty(addToSetFields)) {
    return new Promise((resolve, reject) => {
      QB_Subject.findByIdAndUpdateAsync(subject.id, {
        $set: setFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedSubject => resolve(updatedSubject))
        .catch(err => reject(err))
    })
  } else if (_.isEmpty(setFields)) {
    return new Promise((resolve, reject) => {
      QB_Subject.findByIdAndUpdateAsync(subject.id, {
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedSubject => resolve(updatedSubject))
        .catch(err => reject(err))
    })
  } else {
    return new Promise((resolve, reject) => {
      QB_Subject.findByIdAndUpdateAsync(subject.id, {
        $set: setFields,
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedSubject => resolve(updatedSubject))
        .catch(err => reject(err))
    })
  }
}

const updateChapterById = (chapter, addToSetFields, setFields) => {
  if (_.isEmpty(addToSetFields)) {
    return new Promise((resolve, reject) => {
      QB_Chapter.findByIdAndUpdateAsync(chapter.id, {
        $set: setFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedChapter => resolve(updatedChapter))
        .catch(err => reject(err))
    })
  } else if (_.isEmpty(setFields)) {
    return new Promise((resolve, reject) => {
      QB_Chapter.findByIdAndUpdateAsync(chapter.id, {
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedChapter => resolve(updatedChapter))
        .catch(err => reject(err))
    })
  } else {
    return new Promise((resolve, reject) => {
      QB_Chapter.findByIdAndUpdateAsync(chapter.id, {
        $set: setFields,
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedChapter => resolve(updatedChapter))
        .catch(err => reject(err))
    })
  }
}

const updateQuestionById = (question, addToSetFields, setFields) => {
  if (_.isEmpty(addToSetFields)) {
    return new Promise((resolve, reject) => {
      Question.findByIdAndUpdateAsync(question.id, {
        $set: setFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedQuestion => resolve(updatedQuestion))
        .catch(err => reject(err))
    })
  } else if (_.isEmpty(setFields)) {
    return new Promise((resolve, reject) => {
      Question.findByIdAndUpdateAsync(question.id, {
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedQuestion => resolve(updatedQuestion))
        .catch(err => reject(err))
    })
  } else {
    return new Promise((resolve, reject) => {
      Question.findByIdAndUpdateAsync(question.id, {
        $set: setFields,
        $addToSet: addToSetFields
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      })
        .then(updatedQuestion => resolve(updatedQuestion))
        .catch(err => reject(err))
    })
  }
}

module.exports = {
  deleteQuestionById,
  findQbClassByClassNameAndUserId,
  findQbChapterByChapterNameAndUserId,
  findAllQbClassesByUserId,
  findAllQbClasses,
  findAllQuestionsByIds,
  createQuestion,
  createQuestionPaper,
  addQuestionPaperToExamById,
  createOrUpdateQuestionInQBChapterByName,
  createOrUpdateChapterInQBSubjectBySubjectAndClassName,
  createOrUpdateSubjectInQBClassByName,
  createNewQuestionObj,
  createNewResult,
  populateFieldsInQbClasses,
  findSubjectBySubjectClassAndUserId,
  addQuestionsToQuestionPaperById,
  addQuestionToQuestionPaperById,
  populateFieldsInQbSubjects,
  populateFieldsInQbChapters,
  populateFieldsInQuestionPapers,
  findAllQbSubjectsByUserId,
  findAllQbSubjects,
  findAllQbChaptersByUserId,
  findAllQbChapters,
  updateQuestionById,
  updateChapterById,
  updateSubjectById,
  findSubjectById,
  findChapterById,
  findClassById,
  removeSubjectFromClassById,
  removeChapterFromSubjectById
}

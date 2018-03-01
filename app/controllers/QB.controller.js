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
    newQues.options.forEach((opt_j, j) => {
      if (_.indexOf(newQues.answersIndex, j) !== -1) {
        newQues.newOptions.push({
          opt: opt_j,
          isAns: true
        })
      } else {
        newQues.newOptions.push({
          opt: opt_j,
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

module.exports = {
  deleteQuestionById,
  findQbClassByClassNameAndUserId,
  findQbChapterByChapterNameAndUserId,
  findAllQbClassesByUserId,
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
  populateFieldsInQuestionPapers
}

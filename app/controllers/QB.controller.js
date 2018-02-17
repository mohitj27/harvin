const errorHandler = require('../errorHandler');
const Question = require('./../models/Question');
const QB_Class = require('./../models/QB_Class');
const QB_Subject = require('./../models/QB_Subject');
const QB_Chapter = require('./../models/QB_Chapter');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const deleteQuestionById = function (questionId) {
  return new Promise(function (resolve, reject) {
    Question.findByIdAndRemove(questionId, function (err, deletedQuestion) {
      if (err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(deletedQuestion)
    })
  });
}

const findQbClassByClassNameAndUserId = function (className, user) {
  return new Promise(function (resolve, reject) {
    QB_Class.findOneAsync({
        className,
        addedBy: user
      })
      .then(foundClass => resolve(foundClass))
      .catch(err => reject(err))
  });
}

const findQbChapterByChapterNameAndUserId = function (chapterName, user) {
  return new Promise(function (resolve, reject) {
    QB_Chapter.findOneAsync({
        chapterName,
        addedBy: user
      })
      .then(foundChapter => resolve(foundChapter))
      .catch(err => reject(err))
  });
}

const findAllQbClassesByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    QB_Class.findAsync({
        addedBy: user
      })
      .then(foundClasses => resolve(foundClasses))
      .catch(err => reject(err))
  });
}

const populateFieldInQbChapter = function (chapter, field) {
  return new Promise(function (resolve, reject) {
    QB_Chapter
      .populate(chapter, 'questions')
      .then(foundChapter => resolve(foundChapter))
      .catch(err => resolve(err))
  });
}

const findAllQuestionsByIds = function (questionIds) {
  return new Promise(function (resolve, reject) {
    Question.
    findAsync({
        _id: {
          $in: questionIds
        }
      })
      .then(foundQuestions => resolve(foundQuestions))
      .catch(err => resolve(err))
  });
}

module.exports = {
  deleteQuestionById,
  findQbClassByClassNameAndUserId,
  findQbChapterByChapterNameAndUserId,
  findAllQbClassesByUserId,
  populateFieldInQbChapter,
  findAllQuestionsByIds
}

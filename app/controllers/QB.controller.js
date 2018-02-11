const errorHandler = require('../errorHandler');
const Question = require('./../models/Question');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const deleteQuestionById = function (questionId) {
  return new Promise(function(resolve, reject) {
    Question.findByIdAndRemove(questionId, function (err, deletedQuestion) {
      if(err) return reject(errorHandler.getErrorMessage(err))
      else return resolve(deletedQuestion)
    })
  });
}

module.exports = {
  deleteQuestionById
}

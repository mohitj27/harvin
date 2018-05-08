const errorHandler = require('../errorHandler')
const R_Question = require('./../models/R_Question')
const _ = require('lodash')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const getQuestions = function (query) {
  query = query ? query : {}
  return new Promise(function (resolve, reject) {
    R_Question.find(query)
      .then(foundQuestions => resolve(foundQuestions))
      .catch(err => reject(err))
  })
}

const addQuestion = function (questionObj) {
  return new Promise(function (resolve, reject) {
    R_Question.create(questionObj)
    .then(createdQues => resolve(createdQues))
    .catch(err => reject(err))
  })
}

module.exports = {
  addQuestion,
  getQuestions
}

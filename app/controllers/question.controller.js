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

const checkAns = (questionId, answers) => {
  console.log(questionId
    , answers)

  return new Promise(async (resolve, reject) => {
    let isCorrect = true
    try {
      // find the question
      const foundQuestions = await getQuestions({
        _id: questionId
      })
      console.log(foundQuestions)
      // if question not found - return 
      if (foundQuestions.length < 1) return resolve(null)
      const foundQuestion = foundQuestions[0]

      // the options of found question
      let options = foundQuestion.options

      // remove those options which are not correct ans
      _.remove(options, (o) => !o.isAns)

      // if given ans are not of same length as corrects ans
      if (options.length !== answers.length) return resolve(false)

      // check each correct option with given ans
      for (let opt of options) {
        if (opt.isAns) {
          if (_.findIndex(answers, (o) => o == opt._id) === -1) {
            isCorrect = false
            break
          }
        }
      }

      // return the result
      return resolve(isCorrect)

    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  addQuestion,
  getQuestions,
  checkAns
}
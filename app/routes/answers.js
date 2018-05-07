const express = require('express')
const ansController = require('../controllers/answer.controller')
const quesController = require('../controllers/question.controller')
const errorHandler = require('../errorHandler/index')
const middleware = require('../middleware')
const validator = require('validator')
const mongoose = require('mongoose')
const router = express.Router()

router.post('/', async (req, res, next) => {
  const answers = JSON.parse(req.body.answers)
  const marksArray = []
  for (let ans of answers) {
    let isCorrect = await quesController.checkAns(ans._id, ans.options)
    marksArray.push(isCorrect)
  }

  const marks = marksArray.reduce((sum, isCorrect) => isCorrect ? sum + 1 : sum + 0, 0)

  res.json({
    success: true,
    marks: `${marks} / ${answers.length}`
  })

})

module.exports = router
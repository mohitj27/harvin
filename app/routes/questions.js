const express = require('express')
const quesController = require('../controllers/question.controller')
const errorHandler = require('../errorHandler/index')
const middleware = require('../middleware')
const validator = require('validator')
const router = express.Router()

router.post(
  '/',
  async (req, res, next) => {
    const body = req.body
    try {
      const addedQues = await quesController.addQuestion({
        question: body.question
      })
      return res.sendStatus(200)
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  '/',
  async (req, res, next) => {
    try {
      const foundQuestions = await quesController.getQuestions()
      return res.json({questions: foundQuestions})
    } catch (e) {
      next(e)
    }
  }
)

module.exports = router
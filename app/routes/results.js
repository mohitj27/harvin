const express = require('express')
const resultController = require('../controllers/result.controller')
const middleware = require('../middleware')

const router = express.Router()
// TODO: student batch in db
router.get('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    let foundResults = await resultController.findAllResults()
    foundResults = await resultController.populateFieldsInResults(foundResults, ['user.profile.batch', 'exam'])
    res.render('resultDb', {
      results: foundResults
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router

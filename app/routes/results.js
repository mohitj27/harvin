const express = require('express')
const resultController = require('../controllers/result.controller')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')

const router = express.Router()
// TODO: student batch in db
router.get('/', async (req, res, next) => {
  try {
    let foundResults = await resultController.findAllResults()
    foundResults = await resultController.populateFieldsInResults(foundResults, ['user.profile.batch', 'exam'])
    res.render('resultDb', {
      results: foundResults
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/allresults', async (req, res, next) => {

  try {
    let foundResults = await resultController.findAllResults()
    if (!foundResults) return errorHandler.errorResponse('NOT_FOUND', 'user', next)

    return res.json({
      results: foundResults
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

module.exports = router

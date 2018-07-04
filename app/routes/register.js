const express = require('express')
const resultController = require('../controllers/result.controller')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')

const router = express.Router()
// TODO: student batch in db
router.post('/', async (req, res, next) => {
    try {
        console.log('req.body');
        // let foundResults = await resultController.findAllResults()
        // foundResults = await resultController.populateFieldsInResults(foundResults, ['user.profile.batch', 'exam'])
        // res.render('resultDb', {
        //   results: foundResults
        // })
    } catch (err) {
        // next(err || 'Internal Server Error')
    }
})

module.exports = router

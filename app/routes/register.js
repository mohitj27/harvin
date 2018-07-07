const express = require('express')
const registerController = require('../controllers/register.controller')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')

const router = express.Router()
// TODO: student batch in db
router.post('/', async (req, res, next) => {
    try {
        res.send(registerController.registerUser(req.body));
    } catch (err) {
        next(err || 'Internal Server Error')
    }
})

module.exports = router

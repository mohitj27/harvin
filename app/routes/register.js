const express = require('express')
const registerController = require('../controllers/register.controller')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')

const router = express.Router()
// TODO: student batch in db
router.post('/', async (req, res, next) => {
    try {
        const result = await registerController.registerUser(req.body);
        console.log('\n\nres after coming from controller is: ', result, '\n\n')
        res.sendStatus(200);
    } catch (err) {
        next(err || 'Internal Server Error')
    }
})

module.exports = router

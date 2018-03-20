const express = require('express')
const passport = require('passport')
const router = express.Router()
const validator = require('validator')
const _ = require('lodash')
const errorHandler = require('../errorHandler')
const userController = require('../controllers/user.controller')
const batchController = require('../controllers/batch.controller')
const profileController = require('../controllers/profile.controller')
const progressController = require('../controllers/progress.controller')
router.get('/loginState',(req,res,next)=>{
  res.send(200)
})
module.exports = router

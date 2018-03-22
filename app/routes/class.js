const express = require('express')
const classController = require('../controllers/class.controller')
const router = express.Router()
const middleware = require('../middleware')

// helper- class
router.get('/:className', middleware.isLoggedIn, async function (req, res, next) {
  try {
    const foundClass = await classController.findClassByName(req.params.className)
    foundClass.populate('subjects', (err, foundClass) => {
      if (err) return next(err || 'Internal Server Error')
      else {
        return res.json({
          classs: foundClass
        })
      }
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/', middleware.isLoggedIn, async (req, res, next) => {
  try {
    const foundClasses = await classController.findClassesByUserId(req.user)
    return res.json({
      classes: foundClasses
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

module.exports = router

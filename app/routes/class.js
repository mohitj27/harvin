const express = require('express')
const classController = require('../controllers/class.controller')
const router = express.Router()

// helper- class
router.get('/:className', async function (req, res, next) {
  try {
    const foundClass = await classController.findClassByName(req.params.className)
    foundClass.populate('subjects', (err, foundClass) => {
      if (err) return next(err)
      else {
        return res.json({
          classs: foundClass
        })
      }
    })
  } catch (e) {
    next(e)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const foundClasses = await classController.findClassesByUserId(req.user)
    return res.json({
      classes: foundClasses
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router

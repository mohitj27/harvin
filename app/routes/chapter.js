const express = require('express')
const chapterController = require('../controllers/chapter.controller')
const router = express.Router()
const middleware = require('../middleware')

router.get('/:chapterName' , middleware.isLoggedIn, async function (req, res, next) {
  const chapterName = req.params.chapterName

  try {
    const foundChapter = await chapterController.findChapterByChapterNameAndUserId(chapterName, req.user)
    foundChapter.populate('topics', (err, foundChapter) => {
      if (err) return next(err || 'Internal Server Error')
      else {
        return res.json({
          chapter: foundChapter
        })
      }
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

module.exports = router

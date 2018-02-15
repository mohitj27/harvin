const express = require("express");
const Chapter = require("../models/Chapter");
const errors = require("../error");
const middleware = require("../middleware");
const chapterController = require('../controllers/chapter.controller');
const router = express.Router();

router.get("/:chapterName", async function(req, res, next) {

  const chapterName = req.params.chapterName;

  try{
    const foundChapter = await chapterController.findChapterByChapterNameAndUserId(chapterName, req.user)
    foundChapter.populate('topics', (err, foundChapter) => {
      if (err) return next(err)
      else return res.json({chapter: foundChapter})
    })
  } catch(e) {
    next(e)
  }

});


module.exports = router;

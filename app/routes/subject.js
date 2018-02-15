const express = require("express");
const Class = require("../models/Subject");
const errors = require("../error");
const middleware = require("../middleware");
const subjectController = require('../controllers/subject.controller');
const router = express.Router();

//helper- subject
router.get("/:subjectName",async function(req, res, next) {

  const subjectName = req.params.subjectName;
  const className = req.query.className;

  try{
    const foundSubject = await subjectController.findSubjectBySubjectClassAndUserId(subjectName, className, req.user)
    foundSubject.populate('chapters', (err, foundSubject) => {
      if (err) return next(e)
      else return res.json({subject: foundSubject})
    })
  } catch (e) {
    next(e)
  }
});

module.exports = router;

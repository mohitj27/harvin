const express = require('express');
const ansController = require('../controllers/answer.controller');
const quesController = require('../controllers/question.controller');
const errorHandler = require('../errorHandler/index');
const middleware = require('../middleware');
const validator = require('validator');
const mongoose = require('mongoose');
const userController = require('../controllers/user.controller');
const testResultController = require('../controllers/testResult.controller.js');
const testResultController2 = require('../controllers/testResult.controller2.js');
const testResultController3 = require('../controllers/testResult.controller3.js');
const router = express.Router();
const util = require('util');
router.post('/:id', middleware.isLoggedIn, async (req, res, next) => {
  try {
    // console.log('req', req.user);
    // console.log('request', req.body);
    // console.log('request.body.answers', req.body.answers);
    // testResultController.resultTest(req.body.testId);
    // res.json({
    //   success: true,
    //   marks: `100`,
    // });

    console.log("============================request body answer===============================================")
    // console.log("req.body.answers", util.inspect(req.body.answers, { showHidden: false, depth: null }))
    const sectionAnswers = JSON.parse(req.body.answers);
    const sectionAnswerMine = util.inspect(req.body.answers, { showHidden: false, depth: null });
    var unansweredQues = []
    // sectionAnswerMine.forEach(e=>e.forEach)
    // console.log("req.body.testId : " + req.body.testId + " ----" + sectionAnswerMine);

    testResultController3.resultTest(req.body.testId, sectionAnswers).then((finalResult) => {
      var marks = 0;
      finalResult.sections.forEach(sec => {
        marks += sec.marks;
      });
      finalResult.mTotal = marks;
      finalResult.testId = req.body.testId;
      finalResult.userId = req.user.profile;
      // console.log("---++++++++++++++++++++++++++++++++++ response recieved ---++++++++++++++++++++++++++++++++++ \n", finalResult)
      var response = {
        success: true,
        marks: finalResult.mTotal,
        res: finalResult
      }
      // console.log(req.user);
      testResultController3.saveResultToDb(finalResult)
      res.json(response);
    })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

const express = require("express");
const moment = require("moment-timezone");
const Batch = require("../models/Batch");
const QB_Class = require("../models/QB_Class");
const QB_Subject = require("../models/QB_Subject");
const QB_Chapter = require("../models/QB_Chapter");
const Question = require("../models/Question");
const QuestionPaper = require("../models/QuestionPaper");
const User = require("../models/User.js");
const Profile = require("../models/Profile.js");
const Result = require("../models/Result.js");
const Center = require("../models/Center.js");
const Exam = require("../models/Exam");
const errors = require("../error");
const Async = require('async');
const errorHandler = require("../errorHandler");
const examController = require('../controllers/exam.controller.js');
const batchController = require('../controllers/batch.controller.js');
const QBController = require('../controllers/QB.controller.js');
const _ = require('lodash');
const middleware = require("../middleware");
const validator = require('validator');
const router = express.Router();

router.get("/", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  res.locals.flashUrl = req.originalUrl;

  try {
    let foundExams = await examController.findExamsByUserId(req.user)

    foundExams = await examController.populateFieldInExams(foundExams, 'batch')
    res.render("exams", {
      foundExams
    });
  } catch (e) {
    next(e);
  }

});

router.get("/new", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  res.locals.flashUrl = req.originalUrl;

  try {
    const foundBatches = await batchController.findBatchByUserId(req.user)
    res.render("newExam", {
      batches: foundBatches
    });
  } catch (e) {
    next(e)
  }

});

router.post("/", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  res.locals.flashUrl = req.originalUrl;

  var examName = req.body.examName || '';
  var examDate = req.body.examDate || '';
  var examType = req.body.examType || '';
  var batchId = req.body.batchName || '';
  var positiveMarks = req.body.posMarks || '';
  var negativeMarks = req.body.negMarks || '';
  var maximumMarks = req.body.maxMarks || '';
  var totalTime = req.body.totalTime || '';

  if (!examName || validator.isEmpty(examName)) return errorHandler.errorResponse('INVALID_FIELD', 'exam name', next)
  if (!examDate || validator.isEmpty(examDate)) return errorHandler.errorResponse('INVALID_FIELD', 'exam date', next)
  if (!examType || validator.isEmpty(examType)) return errorHandler.errorResponse('INVALID_FIELD', 'exam type', next)
  if (!batchId || !validator.isMongoId(batchId)) return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)
  if (!positiveMarks || validator.isEmpty(positiveMarks)) return errorHandler.errorResponse('INVALID_FIELD', 'positive marks', next)
  if (!negativeMarks || validator.isEmpty(negativeMarks)) return errorHandler.errorResponse('INVALID_FIELD', 'negative marks', next)
  if (!maximumMarks || validator.isEmpty(maximumMarks)) return errorHandler.errorResponse('INVALID_FIELD', 'maximum marks', next)
  if (!totalTime || validator.isEmpty(totalTime)) return errorHandler.errorResponse('INVALID_FIELD', 'total time', next)

  var newExam = {
    examName,
    examDate,
    batchId,
    examType,
    positiveMarks,
    negativeMarks,
    maximumMarks,
    totalTime
  };

  try {
    const updatedExam = await examController.createOrUpdateExamByExamNameAndUserId(newExam, req.user)
    req.flash("success", examName + " created/updated Successfully");
    res.redirect(req.header('Referer'));
  } catch (e) {
    next(e)
  }
});

router.get("/qbData", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  res.locals.flashUrl = req.originalUrl;

  const className = req.query.className || '';
  const subjectName = req.query.subjectName || '';
  const chapterName = req.query.chapterName || '';
  const examId = req.query.examId || '';


  if (!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)
  if (!subjectName || validator.isEmpty(subjectName)) return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
  if (!chapterName || validator.isEmpty(chapterName)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter name', next)
  if (!examId || !validator.isMongoId(examId)) return errorHandler.errorResponse('INVALID_FIELD', 'exam id', next)

  try {
    const foundClasses = await QBController.findAllQbClassesByUserId(req.user)
    let foundChapter = await QBController.findQbChapterByChapterNameAndUserId(chapterName, req.user)
    foundChapter = await QBController.populateFieldInQbChapter(foundChapter, 'questions')

    return res.render("chooseFromQB", {
      classes: foundClasses,
      questions: foundChapter.questions,
      className: className,
      subjectName: subjectName,
      chapterName: chapterName,
      examId: examId
    });
  } catch (err) {
    return next(err)
  }
});

router.get("/:examId/edit", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  var examId = req.params.examId;
  //TODO: render not found page
  if (!examId || !validator.isMongoId(examId)) return errorHandler.errorResponse('INVALID_FIELD', 'exam id', next)

  try {
    const foundBatches = await batchController.findBatchByUserId(req.user)
    let foundExam = await examController.findExamById(examId)
    foundExam = await examController.populateFieldInExams(foundExam, 'batch')
    res.render("editExam", {
      exam: foundExam,
      batches: foundBatches
    });
  } catch (e) {
    next(e)
  }
});

router.put("/:examId", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  res.locals.flashUrl = req.headers.referer;

  var examId = req.params.examId;
  var examName = req.body.examName;
  var examDate = req.body.examDate;
  var examType = req.body.examType;
  var batchId = req.body.batchName;
  var positiveMarks = req.body.posMarks;
  var negativeMarks = req.body.negMarks;
  var maximumMarks = req.body.maxMarks;
  var totalTime = req.body.totalTime;

  if (!examId || !validator.isMongoId(examId)) return errorHandler.errorResponse('INVALID_FIELD', 'exam id', next)
  if (!examName || validator.isEmpty(examName)) return errorHandler.errorResponse('INVALID_FIELD', 'exam name', next)
  if (!examDate || validator.isEmpty(examDate)) return errorHandler.errorResponse('INVALID_FIELD', 'exam date', next)
  if (!examType || validator.isEmpty(examType)) return errorHandler.errorResponse('INVALID_FIELD', 'exam type', next)
  if (!batchId || !validator.isMongoId(batchId)) return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)
  if (!positiveMarks || validator.isEmpty(positiveMarks)) return errorHandler.errorResponse('INVALID_FIELD', 'positive marks', next)
  if (!negativeMarks || validator.isEmpty(negativeMarks)) return errorHandler.errorResponse('INVALID_FIELD', 'negative marks', next)
  if (!maximumMarks || validator.isEmpty(maximumMarks)) return errorHandler.errorResponse('INVALID_FIELD', 'maximum marks', next)
  if (!totalTime || validator.isEmpty(totalTime)) return errorHandler.errorResponse('INVALID_FIELD', 'total time', next)

  const newExam = {
    examName,
    examDate,
    examType,
    batchId,
    positiveMarks,
    negativeMarks,
    maximumMarks,
    totalTime
  }

  try {
    const updatedExam = await examController.updateExamById(examId, newExam, req.user)
    req.flash("success", examName + " updated Successfully");
    res.redirect("/admin/exams");
  } catch (e) {
    next(e)
  }
});

router.delete("/:examId", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  var examId = req.params.examId || '';

  if (!examId || !validator.isMongoId(examId)) return errorHandler.errorResponse('INVALID_FIELD', 'exam id', next)

  try {
    const removedExam = await examController.deleteExamById(examId)
    req.flash("success", removedExam.examName + " removed Successfully");
    res.redirect(req.headers.referer);
  } catch (err) {
    next(err)
  }
});

//TODO: remove question functionality only remove question from question paper not from question bank

router.get("/:examId/question-paper", middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  res.locals.flashUrl = req.headers.referer;
  var examId = req.params.examId || '';

  if (!examId || !validator.isMongoId(examId)) return errorHandler.errorResponse('INVALID_FIELD', 'exam id', next)

  try {
    let foundExam = await examController.findExamById(examId)
    foundExam = await examController.populateFieldInExams(foundExam, 'questionPaper')
    let foundQuestions = await QBController.findAllQuestionsByIds(foundExam.questionPaper.questions)
    return res.render("editQuesPaper", {
      exam: foundExam,
      questions: foundQuestions
    });
  } catch(e) {
    return next(e)
  }
  
});

router.post("/:examId/question-paper", middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  var examId = req.params.examId;
  var optionString = req.body.options || "";
  var answerString = req.body.answer || "";

  var className = req.body.className;
  var subjectName = req.body.subjectName;
  var chapterName = req.body.chapterName;

  //check the data type of options, if string convert to array
  if (typeof (req.body.options) == typeof ("")) {
    optionString = [];
    optionString.push(req.body.options || "");
  }
  //check the data type of answer, if string convert to array
  if (typeof (req.body.answer) == typeof ("")) {
    answerString = [];
    answerString.push(req.body.answer || "");
  }

  //data for new question
  var newQues = {
    question: req.body.question,
    answers: [],
    options: [],
    newOptions: [],
    answersIndex: [],
    addedBy: req.user
  };

  //pushing options in options array
  for (var i = 0; i < optionString.length; i++) {
    if (optionString[i] != '')
      newQues.options.push(optionString[i]);
  }

  //pushing answers in answer array
  for (var j = 0; j < answerString.length; j++) {
    if (answerString[j] != '')
      newQues.answers.push(answerString[j]);
  }

  newQues.answers.forEach((answer) => {
    newQues.options.forEach((option, optIndex) => {
      if (answer === option) {
        newQues.answersIndex.push(optIndex);
      }
    });
  });

  newQues.options.forEach((opt_j, j) => {
    if (_.indexOf(newQues.answersIndex, j) != -1) newQues.newOptions.push({
      opt: opt_j,
      isAns: true
    })
    else newQues.newOptions.push({
      opt: opt_j,
      isAns: false
    })
  })

  Async.waterfall(
    [
      //finding particular exam
      function (callback) {
        Exam.findById(examId, (err, foundExam) => {
          if (!err && foundExam) {
            callback(null, foundExam);
          } else {
            callback(err);
          }
        });
      },
      //creating new question
      function (foundExam, callback) {
        Question.create(newQues, (err, createdQuestion) => {
          if (!err && createdQuestion) {
            callback(null, foundExam, createdQuestion);
          } else {
            callback(err);
          }
        });
      },
      //creating new question paper
      function (foundExam, createdQuestion, callback) {
        questionPaperId = foundExam.questionPaper;
        //if already a question paper available for this exam, update it
        if (questionPaperId) {
          QuestionPaper.findByIdAndUpdate(questionPaperId, {
              $addToSet: {
                questions: createdQuestion._id
              }
            }, {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            },
            (err, updatedQuestionPaper) => {
              if (!err && updatedQuestionPaper) {
                callback(null, foundExam, createdQuestion, updatedQuestionPaper);
              } else {
                callback(err);
              }
            });
        } else {
          //else create new question paper
          questions = [];
          questions.push(createdQuestion._id);
          var questionPaperData = {
            questions
          };
          QuestionPaper.create(questionPaperData, (err, createdQuestionPaper) => {
            if (!err && createdQuestionPaper) {
              callback(null, foundExam, createdQuestion, createdQuestionPaper);
            } else {
              callback(err);
            }
          });
        }
      },

      //adding updated questionpaper to exam
      function (foundExam, createdQuestion, updatedQuestionPaper, callback) {
        foundExam.questionPaper = updatedQuestionPaper._id;
        foundExam.save((err, updatedExam) => {
          if (!err && updatedExam) {
            callback(null, updatedExam, createdQuestion);
          } else {
            callback(err);
          }
        });
      },

      //add this question to question Bank also
      function (updatedExam, createdQuestion, callback) {
        QB_Chapter.findOneAndUpdate({
            chapterName: chapterName
          }, {
            $addToSet: {
              questions: createdQuestion
            },
            $set: {
              chapterName: chapterName,
              addedBy: req.user
            }
          }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          },
          function (err, createdChapter) {
            if (!err && createdChapter) {
              callback(null, updatedExam, createdQuestion, createdChapter);
            } else {
              console.log(err);
              callback(err);
            }
          }
        );
      },
      function (updatedExam, createdQuestion, createdChapter, callback) {
        QB_Subject.findOneAndUpdate({
            subjectName: subjectName,
            className: className
          }, {
            $addToSet: {
              chapters: createdChapter
            },
            $set: {
              subjectName: subjectName,
              addedBy: req.user
            }
          }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          },
          function (err, createdSubject) {
            if (!err && createdSubject) {
              callback(null, updatedExam, createdQuestion, createdChapter, createdSubject);

            } else {
              callback(err);
            }
          }
        );
      },
      function (updatedExam, createdQuestion, createdChapter, createdSubject, callback) {
        QB_Class.findOneAndUpdate({
            className: className
          }, {
            $addToSet: {
              subjects: createdSubject
            },
            $set: {
              className: className,
              addedBy: req.user
            }
          }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          },
          function (err, createdClass) {
            if (!err && createdClass) {
              callback(null);
              req.flash("success", "Question has been added Successfully");
              res.redirect("/admin/exams/" + updatedExam._id + "/question-paper");
            } else {
              callback(err);
            }
          }
        );
      }

    ],
    function (err, result) {
      if (err) {
        console.log(err);
        next(new errors.generic);
      } else {

      }
    }
  );
});

router.get("/:examId/question-paper/chooseFromQB", middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  var examId = req.params.examId;
  QB_Class.find({
    addedBy: req.user
  }, (err, foundClasses) => {
    if (!err && foundClasses) {
      res.render("chooseFromQB", {
        classes: foundClasses,
        examId: examId,
        questions: {}
      });
    }
  });
});



router.post("/:examId/question-paper/chooseFromQB", middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  var examId = req.params.examId;
  var questionsIdString = req.body.questions || "";

  if (typeof (req.body.questions) == typeof ("")) {
    questionsIdString = [];
    questionsIdString.push(req.body.questions || "");
  }

  var questions = []
  for (var i = 0; i < questionsIdString.length; i++) {
    if (questionsIdString[i] != '')
      questions.push(questionsIdString[i]);
  }

  Async.waterfall(
    [
      function (callback) {
        Exam.findById(examId, (err, foundExam) => {
          if (!err && foundExam) {
            if (foundExam.questionPaper && foundExam.questionPaper != null) {
              Async.waterfall(
                [
                  function (callback) {
                    QuestionPaper.findByIdAndUpdate(foundExam.questionPaper, {
                        $addToSet: {
                          questions: {
                            $each: questions
                          }
                        }
                      }, {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                      },
                      (err, foundQuestionPaper) => {
                        if (!err && foundQuestionPaper) {
                          callback(null, foundQuestionPaper);
                        } else {
                          callback(err)
                        }
                      });
                  },
                  function (foundQuestionPaper, callback) {
                    foundExam.questionPaper = foundQuestionPaper._id;
                    foundExam.save((err, updatedExam) => {
                      if (!err && updatedExam) {
                        req.flash("success", "Questions added Successfully");
                        res.redirect("/admin/exams/" + foundExam._id + "/question-paper");
                      } else {
                        callback(err);
                      }
                    });
                  }
                ],
                function (err, result) {
                  if (err) {
                    console.log(err);
                    next(new errors.generic);
                  } else {

                  }
                }
              );
            } else {
              Async.waterfall(
                [
                  function (callback) {
                    var questionPaperData = {
                      questions: questions
                    };
                    QuestionPaper.create(questionPaperData, (err, createdQuestionPaper) => {
                      if (!err && createdQuestionPaper) {
                        callback(null, createdQuestionPaper);
                      } else {
                        callback(err);
                      }
                    });
                  },
                  function (createdQuestionPaper, callback) {
                    foundExam.questionPaper = createdQuestionPaper._id;
                    foundExam.save((err, updatedExam) => {
                      if (!err && updatedExam) {
                        req.flash("success", "Questions added Successfully");
                        res.redirect("/admin/exams/" + foundExam._id + "/question-paper");
                      } else {
                        callback(err);
                      }
                    });
                  }
                ],
                function (err, result) {
                  if (err) {
                    console.log(err);
                    next(new errors.generic);
                  } else {

                  }
                }
              );
            }
          }
        });
      }
    ],
    function (err, result) {
      if (err) {
        console.log(err);
        next(new errors.generic);
      } else {

      }
    }
  );
});

router.post('/:examId/question-paper/:username', (req, res, next) => {
  let examId = req.params.examId;
  let username = req.params.username;
  Exam.findById(examId, (err, foundExam) => {
    if (!err && foundExam) {
      let result = {
        examTakenDate: moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a'),
        nQuestionsAnswered: req.body.nQuestionsAnswered,
        nQuestionsUnanswered: req.body.nQuestionsUnanswered,
        nCorrectAns: req.body.nCorrectAns,
        nIncorrectAns: req.body.nIncorrectAns,
        mTotal: req.body.mTotal,
      };

      User.findOne({
          username: username
        })
        .populate({
          path: 'profile',
          model: 'Profile'
        })
        .exec((err, foundUser) => {
          if (!err && foundUser) {
            let newResult = new Result({
              examTakenDate: result.examTakenDate,
              nQuestionsAnswered: result.nQuestionsAnswered,
              nQuestionsUnanswered: result.nQuestionsUnanswered,
              nCorrectAns: result.nCorrectAns,
              nIncorrectAns: result.nIncorrectAns,
              mTotal: result.mTotal,
              user: foundUser._id,
              exam: foundExam._id
            });
            newResult.save(err => {
              if (!err) {
                Profile.findByIdAndUpdate(
                  foundUser.profile._id, {
                    $addToSet: {
                      results: newResult._id
                    }
                  }, {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                  },
                  (err, updatedProfile) => {
                    if (!err && updatedProfile) {
                      res.json({
                        success: true,
                        msg: "Your result has been saved successfully",
                        result: newResult
                      });
                    }
                  }
                );
              } else {
                console.log('result', err);
                next(new errors.generic);
              }
            });
          }
        });
    } else {
      console.log('exam', err);
      next(new errors.generic);
    }
  });


});

//giving question paper of particular exam
router.get("/:username/exams/:examId/questionPaper", (req, res, next) => {
  //TODO: filter exams, provide only those exams of the batch in which user belongs
  var examId = req.params.examId;
  Exam
    .findById(examId)
    .populate({
      path: "questionPaper",
      model: "QuestionPaper",
      populate: {
        path: "questions",
        model: "Question"
      }
    })
    .exec((err, foundExam) => {
      if (!err && foundExam) {
        var questionPaper = {};
        questionPaper._id = foundExam.questionPaper._id;
        questionPaper.__v = foundExam.questionPaper.__v;
        questionPaper.positiveMarks = foundExam.positiveMarks;
        questionPaper.negativeMarks = foundExam.negativeMarks;
        questionPaper.maximumMarks = foundExam.maximumMarks;
        questionPaper.totalTime = foundExam.totalTime;
        questionPaper.questions = foundExam.questionPaper.questions;

        res.json({
          questionPaper
        });
      } else {
        console.log(err);
      }
    });
});

//Giving exam list
router.get("/:username/exams", (req, res, next) => {
  Exam.find({}, (err, foundExams) => {
    if (!err && foundExams) {
      res.json({
        exams: foundExams
      });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;

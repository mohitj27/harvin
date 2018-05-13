const express = require("express");
const moment = require("moment-timezone");
const errorHandler = require("../errorHandler");
const examController = require("../controllers/exam.controller.js");
const userController = require("../controllers/user.controller.js");
const batchController = require("../controllers/batch.controller.js");
const QBController = require("../controllers/QB.controller.js");
const profileController = require("../controllers/profile.controller.js");
const middleware = require("../middleware");
const validator = require("validator");
const router = express.Router();

router.get(
  "/",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    res.locals.flashUrl = req.originalUrl;

    try {
      let foundExams = await examController.findExamsByUserId(req.user);

      foundExams = await examController.populateFieldsInExams(foundExams, [
        "batch"
      ]);
      res.render("exams", {
        foundExams
      });
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

router.get(
  "/new",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    res.locals.flashUrl = req.originalUrl;

    try {
      const foundBatches = await batchController.findBatchByUserId(req.user);
      res.render("newExam", {
        batches: foundBatches
      });
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

router.post(
  "/",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    res.locals.flashUrl = req.originalUrl;

    var examName = req.body.examName || "";
    var examDate = req.body.examDate || "";
    var examType = req.body.examType || "";
    var batchId = req.body.batchName || "";
    var positiveMarks = req.body.posMarks || "";
    var negativeMarks = req.body.negMarks || "";
    var maximumMarks = req.body.maxMarks || "";
    var totalTime = req.body.totalTime || "";

    if (!examName || validator.isEmpty(examName))
      return errorHandler.errorResponse("INVALID_FIELD", "exam name", next);
    if (!examDate || validator.isEmpty(examDate))
      return errorHandler.errorResponse("INVALID_FIELD", "exam date", next);
    if (!examType || validator.isEmpty(examType))
      return errorHandler.errorResponse("INVALID_FIELD", "exam type", next);
    if (!batchId || !validator.isMongoId(batchId))
      return errorHandler.errorResponse("INVALID_FIELD", "batch", next);
    if (!positiveMarks || validator.isEmpty(positiveMarks))
      return errorHandler.errorResponse(
        "INVALID_FIELD",
        "positive marks",
        next
      );
    if (!negativeMarks || validator.isEmpty(negativeMarks))
      return errorHandler.errorResponse(
        "INVALID_FIELD",
        "negative marks",
        next
      );
    if (!maximumMarks || validator.isEmpty(maximumMarks))
      return errorHandler.errorResponse("INVALID_FIELD", "maximum marks", next);
    if (!totalTime || validator.isEmpty(totalTime))
      return errorHandler.errorResponse("INVALID_FIELD", "total time", next);

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
      const updatedExam = await examController.createOrUpdateExamByExamNameAndUserId(
        newExam,
        req.user
      );
      req.flash(
        "success",
        updatedExam.examName + " created/updated Successfully"
      );
      res.redirect(req.originalUrl);
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

router.get(
  "/qbData",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    res.locals.flashUrl = req.originalUrl;

    const className = req.query.className || "";
    const subjectName = req.query.subjectName || "";
    const chapterName = req.query.chapterName || "";
    const examId = req.query.examId || "";

    if (!className || validator.isEmpty(className))
      return errorHandler.errorResponse("INVALID_FIELD", "class name", next);
    if (!subjectName || validator.isEmpty(subjectName))
      return errorHandler.errorResponse("INVALID_FIELD", "subject name", next);
    if (!chapterName || validator.isEmpty(chapterName))
      return errorHandler.errorResponse("INVALID_FIELD", "chapter name", next);
    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

    try {
      const foundClasses = await QBController.findAllQbClassesByUserId(
        req.user
      );
      let foundChapter = await QBController.findQbChapterByChapterNameAndUserId(
        chapterName,
        req.user
      );
      foundChapter = await QBController.populateFieldsInQbChapters(
        foundChapter, ["questions"]
      );

      return res.render("chooseFromQB", {
        classes: foundClasses,
        questions: foundChapter.questions,
        className: className,
        subjectName: subjectName,
        chapterName: chapterName,
        examId: examId
      });
    } catch (err) {
      return next(err || "Internal Server Error");
    }
  }
);

router.get(
  "/:examId/edit",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    var examId = req.params.examId;
    // TODO: render not found page
    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

    try {
      const foundBatches = await batchController.findBatchByUserId(req.user);
      let foundExam = await examController.findExamById(examId);
      foundExam = await examController.populateFieldsInExams(foundExam, [
        "batch"
      ]);
      res.render("editExam", {
        exam: foundExam,
        batches: foundBatches
      });
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

router.put(
  "/:examId",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
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

    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);
    if (!examName || validator.isEmpty(examName))
      return errorHandler.errorResponse("INVALID_FIELD", "exam name", next);
    if (!examDate || validator.isEmpty(examDate))
      return errorHandler.errorResponse("INVALID_FIELD", "exam date", next);
    if (!examType || validator.isEmpty(examType))
      return errorHandler.errorResponse("INVALID_FIELD", "exam type", next);
    if (!batchId || !validator.isMongoId(batchId))
      return errorHandler.errorResponse("INVALID_FIELD", "batch", next);
    if (!positiveMarks || validator.isEmpty(positiveMarks))
      return errorHandler.errorResponse(
        "INVALID_FIELD",
        "positive marks",
        next
      );
    if (!negativeMarks || validator.isEmpty(negativeMarks))
      return errorHandler.errorResponse(
        "INVALID_FIELD",
        "negative marks",
        next
      );
    if (!maximumMarks || validator.isEmpty(maximumMarks))
      return errorHandler.errorResponse("INVALID_FIELD", "maximum marks", next);
    if (!totalTime || validator.isEmpty(totalTime))
      return errorHandler.errorResponse("INVALID_FIELD", "total time", next);

    const newExam = {
      examName,
      examDate,
      examType,
      batchId,
      positiveMarks,
      negativeMarks,
      maximumMarks,
      totalTime
    };

    try {
      const updatedExam = await examController.updateExamById(
        examId,
        newExam,
        req.user
      );
      req.flash("success", updatedExam.examName + " updated Successfully");
      res.redirect("/admin/exams");
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

router.delete(
  "/:examId",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    var examId = req.params.examId || "";

    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

    try {
      const removedExam = await examController.deleteExamById(examId);
      req.flash("success", removedExam.examName + " removed Successfully");
      res.redirect(req.headers.referer);
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

// TODO: remove question functionality only remove question from question paper not from question bank
// TODO: do not update existing exam, instead give erro

router.get(
  "/:examId/question-paper",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    res.locals.flashUrl = req.headers.referer;
    var examId = req.params.examId || "";

    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

    try {
      let foundExam = await examController.findExamById(examId);
      foundExam = await examController.populateFieldsInExams(foundExam, [
        "questionPaper"
      ]);
      if (!foundExam.questionPaper) {
        const newQuestionPaper = {
          questions: []
        };
        let createdQuestionPaper = await QBController.createQuestionPaper(
          newQuestionPaper
        );
        foundExam = await QBController.addQuestionPaperToExamById(
          foundExam._id,
          createdQuestionPaper
        );
      }
      let foundQuestions = await QBController.findAllQuestionsByIds(
        foundExam.questionPaper.questions
      );
      return res.render("editQuesPaper", {
        exam: foundExam,
        questions: foundQuestions
      });
    } catch (err) {
      return next(err || "Internal Server Error");
    }
  }
);

router.post(
  "/:examId/question-paper",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    res.locals.flashUrl = req.headers.referer;

    const examId = req.params.examId || "";
    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

    var optionString = req.body.options || "";
    var answerString = req.body.answer || "";
    var question = req.body.question || "";

    const className = req.body.className || "";
    const subjectName = req.body.subjectName || "";
    const chapterName = req.body.chapterName || "";

    if (!className || validator.isEmpty(className))
      return errorHandler.errorResponse("INVALID_FIELD", "class name", next);
    if (!subjectName || validator.isEmpty(subjectName))
      return errorHandler.errorResponse("INVALID_FIELD", "subject name", next);
    if (!chapterName || validator.isEmpty(chapterName))
      return errorHandler.errorResponse("INVALID_FIELD", "chapter name", next);
    if (!question || validator.isEmpty(question))
      return errorHandler.errorResponse("INVALID_FIELD", "question", next);

    let newQues = await QBController.createNewQuestionObj(
      optionString,
      answerString,
      question,
      req.user
    );

    try {
      // findExamById
      let foundExam = await examController.findExamById(examId);

      // create new Question
      let createdQuestion = await QBController.createQuestion(newQues);

      // create or update new question paper
      let createdQuestionPaper;
      if (foundExam.questionPaper) {
        createdQuestionPaper = await QBController.addQuestionToQuestionPaperById(
          foundExam.questionPaper,
          createdQuestion
        );
      } else {
        let questions = [];
        questions.push(createdQuestion._id);
        const newQuestionPaper = {
          questions: newQues
        };
        createdQuestionPaper = await QBController.createQuestionPaper(
          newQuestionPaper
        );

        // add question paper to exam
        await QBController.addQuestionPaperToExamById(
          foundExam._id,
          createdQuestionPaper
        );
      }

      // add this question to question bank also
      let updatedChapter = await QBController.createOrUpdateQuestionInQBChapterByName(
        chapterName,
        createdQuestion,
        req.user
      );
      let updatedSubject = await QBController.createOrUpdateChapterInQBSubjectBySubjectAndClassName(
        subjectName,
        className,
        updatedChapter,
        req.user
      );
      let updatedClass = await QBController.createOrUpdateSubjectInQBClassByName(
        className,
        updatedSubject,
        req.user
      );
      updatedChapter = await QBController.updateChapterById(
        updatedChapter, {}, {
          subject: updatedSubject
        }
      );
      updatedSubject = await QBController.updateSubjectById(
        updatedSubject, {}, {
          class: updatedClass
        }
      );

      req.flash("success", "Question has been added Successfully");
      return res.redirect(req.headers.referer);
    } catch (err) {
      return next(err || "Internal Server Error");
    }
  }
);

router.get(
  "/:examId/question-paper/chooseFromQB",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    var examId = req.params.examId || "";
    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

    try {
      const foundClasses = await QBController.findAllQbClassesByUserId(
        req.user
      );
      res.render("chooseFromQB", {
        classes: foundClasses,
        examId: examId,
        questions: {}
      });
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

router.post(
  "/:examId/question-paper/chooseFromQB",
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    var examId = req.params.examId || "";
    if (!examId || !validator.isMongoId(examId))
      return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

    var questionsIdString = req.body.questions || "";

    if (typeof req.body.questions === typeof "") {
      questionsIdString = [];
      questionsIdString.push(req.body.questions || "");
    }

    var questions = [];
    for (var i = 0; i < questionsIdString.length; i++) {
      if (questionsIdString[i] !== "") {
        questions.push(questionsIdString[i]);
      }
    }

    try {
      // find exam by id
      let foundExam = await examController.findExamById(examId);

      let createdQuestionPaper;
      if (foundExam.questionPaper) {
        createdQuestionPaper = await QBController.addQuestionsToQuestionPaperById(
          foundExam.questionPaper,
          questions
        );
      } else {
        var questionPaperData = {
          questions: questions
        };

        createdQuestionPaper = await QBController.createQuestionPaper(
          questionPaperData
        );
        await QBController.addQuestionPaperToExamById(
          foundExam._id,
          createdQuestionPaper
        );
      }

      req.flash("success", "Questions added Successfully");
      res.redirect(req.headers.referer);
    } catch (err) {
      next(err || "Internal Server Error");
    }
  }
);

router.post("/:examId/question-paper/:username", async (req, res, next) => {
  const examId = req.params.examId || "";
  let username = req.params.username || "";

  if (!examId || !validator.isMongoId(examId))
    return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);
  if (!username || validator.isEmpty(username))
    return errorHandler.errorResponse("INVALID_FIELD", "username", next);

  try {
    let foundExam = await examController.findExamById(examId);
    let foundUser = await userController.findUserByUsername(username);
    foundUser = await userController.populateFieldsInUsers(foundUser, [
      "profile"
    ]);
    let result = {
      examTakenDate: moment(Date.now())
        .tz("Asia/Kolkata")
        .format("MMMM Do YYYY, h:mm:ss a"),
      nQuestionsAnswered: req.body.nQuestionsAnswered,
      nQuestionsUnanswered: req.body.nQuestionsUnanswered,
      nCorrectAns: req.body.nCorrectAns,
      nIncorrectAns: req.body.nIncorrectAns,
      mTotal: req.body.mTotal,
      user: foundUser,
      exam: foundExam
    };

    let createdResult = await QBController.createNewResult(result);
    await profileController.addResultInProfileById(
      foundUser.profile._id,
      createdResult
    );
    res.json({
      success: true,
      msg: "Your result has been saved successfully",
      result: createdResult
    });
  } catch (err) {
    next(err || "Internal Server Error");
  }
});

// giving question paper of particular exam
router.get("/:username/exams/:examId/questionPaper", async (req, res, next) => {
  // TODO: filter exams, provide only those exams of the batch in which user belongs
  // TODO: register the user in batch at particular center
  const username = req.params.username;
  const examId = req.params.examId;

  if (!username || validator.isEmpty(username))
    return errorHandler.errorResponse("INVALID_FIELD", "username", next);
  if (!examId || !validator.isMongoId(examId))
    return errorHandler.errorResponse("INVALID_FIELD", "exam id", next);

  try {
    // let userProfileBatch = await userController.findBatchOfUserByUsername(username, next)
    let foundExam = await examController.findExamById(examId);
    foundExam = await examController.populateFieldsInExams(foundExam, [
      "questionPaper"
    ]);
    let populatedQuestionPaper = await QBController.populateFieldsInQuestionPapers(
      foundExam.questionPaper, ["questions"]
    );

    var questionPaper = {};
    questionPaper._id = populatedQuestionPaper._id;
    questionPaper.__v = populatedQuestionPaper.__v;
    questionPaper.positiveMarks = foundExam.positiveMarks;
    questionPaper.negativeMarks = foundExam.negativeMarks;
    questionPaper.maximumMarks = foundExam.maximumMarks;
    questionPaper.totalTime = foundExam.totalTime;
    questionPaper.questions = populatedQuestionPaper.questions;

    return res.json({
      questionPaper
    });
  } catch (err) {
    next(err || "Internal Server Error");
  }
});

// Giving exam list
router.get("/:username/exams", async (req, res, next) => {
  const username = req.params.username;
  if (!username || validator.isEmpty(username))
    return errorHandler.errorResponse("INVALID_FIELD", "username", next);

  try {
    let userBatch = await userController.findBatchOfUserByUsername(
      username,
      next
    );
    if (!userBatch) {
      return res.json({
        success: false,
        msg: 'Batch of user not found'
      })
    }
    let foundExams = await examController.findExamsOfBatchByBatchId(
      userBatch._id
    );
    res.json({
      exams: foundExams
    });
  } catch (err) {
    next(err || "Internal Server Error");
  }
});

module.exports = router;
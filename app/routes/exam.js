var express = require("express"),
	async = require("async"),

	Batch = require("../models/Batch"),
	Subject = require("../models/Subject"),
	Question = require("../models/Question"),
	QuestionPaper = require("../models/QuestionPaper"),
	Exam = require("../models/Exam"),
	errors = require("../error"),
	middleware = require("../middleware"),

	router = express.Router();

router.get("/", (req, res, next) => {
	Exam.find({}, (err, foundExams) => {
		if (!err && foundExams) {
			res.render("exams", {
				foundExams: foundExams
			});
		} else {
			next(new errors.generic);
		}
	});
});

router.get("/new", (req, res, next) => {
	res.render("newExam");
});

router.post("/", (req, res, next) => {
	var examName = req.body.examName;
	var examDate = req.body.examDate;
	var examType = req.body.examType;
	var maximumMarks = req.body.maxMarks;
	var passingMarks = req.body.passMarks;
	var negativeMarks = req.body.negMarks;

	var newExam = {
		examName,
		examDate,
		examType,
		maximumMarks,
		passingMarks,
		negativeMarks,
	};

	Exam.create(newExam, (err, createdExam) => {
		if (!err && createdExam) {
			req.flash("success", examName + " created Successfully");
			res.redirect("/exams");
		} else {
			console.log(err);
			next(new errors.generic);
		}
	});

});

router.get("/:examId/edit", (req, res, next) => {
	var examId = req.params.examId;
	Exam.findById(examId, (err, foundExam) => {
		if (!err && foundExam) {
			res.render("editExam", {
				exam: foundExam
			});
		}
	});
});

router.put("/:examId", (req, res, next) => {
	var examId = req.params.examId;
	var examName = req.body.examName;
	var examDate = req.body.examDate;
	var examType = req.body.examType;
	var maximumMarks = req.body.maxMarks;
	var passingMarks = req.body.passMarks;
	var negativeMarks = req.body.negMarks;

	Exam.findByIdAndUpdate(examId, {
			$set: {
				examName,
				examDate,
				examType,
				maximumMarks,
				passingMarks,
				negativeMarks
			}
		}, {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true
		},
		(err, updatedExam) => {
			if (!err && updatedExam) {
				req.flash("success", examName + " updated Successfully");
				res.redirect("/exams");
			} else {
				console.log(err);
				next(new errors.generic);
			}
		}
	);
});

router.delete("/:examId", (req, res, next) => {
	var examId = req.params.examId;
	Exam.findByIdAndRemove(examId, (err, removedExam) => {
		if (!err && removedExam) {
			req.flash("success", removedExam.examName + " removed Successfully");
			res.redirect("/exams");
		} else {
			console.log(err);
			next(new errors.generic);
		}
	});
});

router.get("/:examId/question-paper", (req, res, next) => {
	var examId = req.params.examId;
	Exam.findById(examId, (err, foundExam) => {
		if (!err && foundExam) {
		}else{
			console.log(err);
		}
	})
	.populate(
		{
			path:"questionPaper",
			model:"QuestionPaper",
			populate:{
				path:"questions",
				model:"Question"		
			}
		}
	)
	.exec((err, foundExam) => {
		if(!err && foundExam){
			res.render("editQuesPaper", {
				exam: foundExam
			});	
		} else {
			console.log(err);
			next(new errors.generic);
		}
	});

});

router.post("/:examId/question-paper", (req, res, next) => {
	var examId = req.params.examId;
	var optionString = req.body.options;
	var answerString = req.body.answer;

	//data for new question
	var newQues = {
		question: req.body.question,
		answer: [],
		options: []
	};

	//pushing options in options array
	for(var i = 0; i < optionString.length; i++){
		if(optionString[i] != '')
			newQues.options.push(optionString[i]);
	}

	//pushing answers in answer array
	for(var j = 0; j < answerString.length; j++){
		if(answerString[j] != '')
			newQues.answer.push(answerString[j]);
	}
	

	async.waterfall(
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
								callback(null, foundExam, updatedQuestionPaper);
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
							callback(null, foundExam, createdQuestionPaper);
						}
					});
				}
			},

			function (foundExam, updatedQuestionPaper, callback) {
				foundExam.questionPaper = updatedQuestionPaper._id;
				foundExam.save((err, updatedExam) => {
					if (!err && updatedExam) {
						req.flash("success", "Question has been added Successfully");
						res.redirect("/exams/"+updatedExam._id+"/question-paper");
						callback(null);
					} else {
						callback(err);
					}
				});
			},

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

module.exports = router;


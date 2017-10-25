var express = require("express"),
	async = require("async"),

	QB_Class = require("../models/QB_Class"),
	QB_Subject = require("../models/QB_Subject"),
	QB_Chapter = require("../models/QB_Chapter"),
	Question = require("../models/Question"),
	errors = require("../error"),
	middleware = require("../middleware"),

	router = express.Router();

router.get("/", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	QB_Class.find({}, function (err, classes) {
		if (err) console.log(err);
	})
	.populate({
		path: "subjects",
		model: "QB_Subject",
	})
	.exec(function (err, classes) {
		if (err) {
			console.log(err);
			req.flash("error", "Please try again");
			res.redirect("/questionBank");
		} else {
			res.render('questionBank', {
				classes: classes,
				questions:{}
			});
		}
	});
});

router.get("/addNew", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	QB_Class.find({}, function (err, classes) {
		if (err) console.log(err);
	})
	.populate({
		path: "subjects",
		model: "QB_Subject",
	})
	.exec(function (err, classes) {
		if (err) {
			console.log(err);
			req.flash("error", "Please try again");
			res.redirect("/questionBank");
		} else {
			res.render('quesBankAddNew', {
				classes: classes,
			});
		}
	});
});

router.get("/qbData", (req, res, next) => {
	var className = req.query.className;
	var subjectName = req.query.subjectName;
	var chapterName = req.query.chapterName;

	QB_Class.findOne({className: className}, (err, foundClass) => {
		if(!err && foundClass){
		}
		else if(err){
			console.log("error",err);
		}
	})
	.populate({
		path:"subjects",
		model:"QB_Subject",
		populate:{
			path:"chapters",
			model:"QB_Chapter",
			populate:{
				path:"questions",
				model:"Question"
			}
		}
	})
	.exec(function (err, qbData) {

		if (!err && qbData) {
			// questions = qbData[subjectName][chapterName][questions];
			subject = qbData.subjects.find(item => item.subjectName == subjectName);
			chapter = subject.chapters.find(item => item.chapterName == chapterName);
			questions = chapter.questions;
			QB_Class.find({}, (err, foundClasses) => {
				if(!err && foundClasses){
					res.render("questionBank",{
						classes: foundClasses,
						questions:questions,
						className:className,
						subjectName:subjectName,
						chapterName:chapterName
					});
				}
			});
			
		}
		else if(err){
			console.log("error",err);
		}
	});
});


router.post("/", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var className = req.body.className;
	var subjectName = req.body.subjectName;
	var chapterName = req.body.chapterName;

	var optionString = req.body.options || "";
	var answerString = req.body.answer || "";
	
	//check the data type of options, if string convert to array
	if(typeof(req.body.options) == typeof("")){
		optionString = [];
		optionString.push(req.body.options || "");
	}
	//check the data type of answer, if string convert to array
	if(typeof(req.body.answer) == typeof("")){
		answerString = [];
		answerString.push(req.body.answer || "");
	}

	//data for new question
	var newQues = {
		question: req.body.question,
		answers: [],
		options: [],
        answersIndex: []
	};

	//pushing options in options array
	for(var i = 0; i < optionString.length; i++){
		if(optionString[i] != '')
			newQues.options.push(optionString[i]);
	}

	//pushing answers in answer array
	for(var j = 0; j < answerString.length; j++){
		if(answerString[j] != '')
			newQues.answers.push(answerString[j]);
	}

    newQues.answers.forEach((answer) => {
        newQues.options.forEach((option, optIndex) => {
            if(answer === option){
                newQues.answersIndex.push(optIndex);
            }
        });
    });

	async.waterfall(
		[
			//creating new question
			function (callback) {
				Question.create(newQues, (err, createdQuestion) => {
					if (!err && createdQuestion) {
						callback(null, createdQuestion);
					} else {
						callback(err);
					}
				});
			},
			function (createdQuestion, callback) {
				QB_Chapter.findOneAndUpdate({
						chapterName: chapterName
					}, {
						$addToSet: {
							questions: createdQuestion
						},
						$set: {
							chapterName: chapterName,
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, createdChapter) {
						if (!err && createdChapter) {
							callback(null,createdQuestion, createdChapter);
						} else {
							console.log(err);
							callback(err);								
						}
					}
				);
			},
			function (createdQuestion, createdChapter, callback) {
				QB_Subject.findOneAndUpdate({
						subjectName: subjectName,
						className: className
					}, {
						$addToSet: {
							chapters: createdChapter
						},
						$set: {
							subjectName: subjectName
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, createdSubject) {
						if (!err && createdSubject) {
							callback(null,createdQuestion, createdChapter, createdSubject);

						} else {
							callback(err);							
						}
					}
				);
			},
			function (createdQuestion, createdChapter, createdSubject, callback) {
				QB_Class.findOneAndUpdate({
						className: className
					}, {
						$addToSet: {
							subjects: createdSubject
						},
						$set: {
							className: className
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, createdClass) {
						if (!err && createdClass) {
							callback(null);
							req.flash("success", "Question added successfully");
							res.redirect("/questionBank/addNew");
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

//helpers
//helper- class
router.get("/class/:className", function (req, res, next) {
	QB_Class.findOne({
			className: req.params.className,
		}, function (err, classs) {
			if (err) {
				console.log(err);
			}
		})
		.populate({
			path: "subjects",
			model: "QB_Subject"

		})
		.exec(function (err, classs) {
			if (err) {
				console.log(err);
				req.flash("error", "Couldn't find the details of chosen class");
				res.redirect("/questionBank");
			} else {

				res.json({
					classs: classs
				});
			}
		});
});

//helper- subject
router.get("/class/:className/subject/:subjectName", function (req, res, next) {
	QB_Subject.findOne({
			subjectName: req.params.subjectName,
			className: req.params.className
		}, function (err, subject) {
			if (err) {
				console.log(err);
				next(new errors.generic);
			}
		})
		.populate({
			path: "chapters",
			model: "QB_Chapter"

		})
		.exec(function (err, subject) {
			if (err) {
				console.log(err);
				req.flash("error", "Couldn't find the details of chosen subject");
				res.redirect("/questionBank");
			} else {
				res.json({
					subject: subject
				});
			}
		});
});

//helper-chapter
router.get("/chapter/:chapterName", function (req, res, next) {
	QB_Chapter.findOne({
			chapterName: req.params.chapterName
		}, function (err, chapter) {
			if (err) {
				console.log(err);
				next(new errors.generic);
			}
		})
		.populate({
			path: "topics",
			model: "Topic"

		})
		.exec(function (err, chapter) {
			if (err) {
				console.log(err);
				req.flash("error", "Couldn't find the details of chosen chapter");
				res.redirect("/questionBank");
			} else {
				res.json({
					chapter: chapter
				});
			}
		});
});

router.get('/refactor', (req, res, next) => {
	Question.find({}, (err, foundQuestions) => {
		if(!err && foundQuestions){
			var answerIndex = [];
			foundQuestions.forEach((question, quesIndex) => {
				answerIndex = [];
				question.answers.forEach((answer) => {
					question.options.forEach((option, optIndex) => {
						if(answer === option){
							answerIndex.push(optIndex);
						}
					}); 
				});
				Question.findByIdAndUpdate(question._id,
					{
						$set:{
							answersIndex: answerIndex
						}
					},
					{
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, updatedQuestion) {
						if (!err && updatedQuestion) {
						} else {
							console.log(err);
						}
					}
				);
			});
			res.send('ok');
		}
	});
});

module.exports = router;


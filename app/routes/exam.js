var express = require("express"),
	async = require("async"),
	moment = require("moment-timezone"),
	
	Batch = require("../models/Batch"),
	QB_Class = require("../models/QB_Class"),
	QB_Subject = require("../models/QB_Subject"),
	QB_Chapter = require("../models/QB_Chapter"),
	Question = require("../models/Question"),
	QuestionPaper = require("../models/QuestionPaper"),
	User = require("../models/User.js"),
	Profile = require("../models/Profile.js"),
	Result = require("../models/Result.js"),
	Exam = require("../models/Exam"),
	errors = require("../error"),
	middleware = require("../middleware"),

	router = express.Router();

router.get("/", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	Exam.find({})
        .populate(
            {
                path:'batch',
                model: 'Batch'
            }
        )
        .exec((err, foundExams) => {
            if (!err && foundExams) {
                res.render("exams", {
                    foundExams: foundExams
                });
            } else {
                console.log('error', err);
                next(new errors.generic);
            }
        });
});

router.get("/new", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
    Batch.find({}, (err, foundBatches) => {
        if(!err && foundBatches){
            res.render("newExam", {batches: foundBatches});
        }else{
            console.log('error', err);
            next(new errors.generic());
        }
    });

});

router.post("/", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var examName = req.body.examName;
	var examDate = req.body.examDate;
	var examType = req.body.examType;
	var batchId = req.body.batchName;
	var positiveMarks = req.body.posMarks;
	var negativeMarks = req.body.negMarks;
	var totalTime = req.body.totalTime;

	var newExam = {
		examName,
		examDate,
		examType,
		positiveMarks,
		negativeMarks,
        totalTime
	};

	Exam.findOneAndUpdate(newExam,
        {
            $set:{
                batch: batchId
            }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        },
        (err, createdExam) => {
		if (!err && createdExam) {
			req.flash("success", examName + " created Successfully");
			res.redirect("/exams");
		} else {
			console.log(err);
			next(new errors.generic);
		}
	});

});

router.get("/qbData" , middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var className = req.query.className;
	var subjectName = req.query.subjectName;
	var chapterName = req.query.chapterName;

    if(!className){
        next(new errors.noContent('Please select class name'));
    }

    else if(!subjectName){
        next(new errors.noContent('Please select subject name'));
    }

    else if(!chapterName){
        console.log('called');
        next(new errors.generic('Please select chapter name'));
    }

    else{
        var examId = req.query.examId;

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
                            res.render("chooseFromQB",{
                                classes: foundClasses,
                                questions:questions,
                                className:className,
                                subjectName:subjectName,
                                chapterName:chapterName,
                                examId:examId
                            });
                        }
                    });

                }
                else if(err){
                    console.log("error",err);
                }
            });
    }


});

router.get("/:examId/edit", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var examId = req.params.examId;

    Batch.find({}, (err, foundBatches) => {
        if(!err && foundBatches){
            Exam.findById(examId)
                .populate(
                    {
                        path:'batch',
                        model: "Batch"
                    }
                )
                .exec((err, foundExam) => {
                    if (!err && foundExam) {
                        res.render("editExam", {
                            exam: foundExam,
                            batches: foundBatches
                        });
                    }
                })
        }else{
            console.log('error', err);
            next(new errors.generic());
        }
    });


});

router.put("/:examId", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var examId = req.params.examId;
	var examName = req.body.examName;
	var examDate = req.body.examDate;
	var examType = req.body.examType;
    var batchId = req.body.batchName;
    var positiveMarks = req.body.posMarks;
	var negativeMarks = req.body.negMarks;
	var totalTime = req.body.totalTime;

	Exam.findByIdAndUpdate(examId, {
			$set: {
				examName,
				examDate,
				examType,
                batch: batchId,
				positiveMarks,
				negativeMarks,
                totalTime
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

router.delete("/:examId", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
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

router.get("/:examId/question-paper", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
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
		}
	)
	.exec((err, foundExam) => {
		if(!err && foundExam){

			QB_Class.find({}, (err, foundClasses) => {
				if(!err && foundClasses){
					if( foundExam.questionPaper && foundExam.questionPaper != null){
						Question.find(
							{
								_id:{$in:foundExam.questionPaper.questions}
							},
							(err, foundQuestions) => {
								if(!err && foundQuestions){
									res.render("editQuesPaper", {
										classes: foundClasses,
										exam: foundExam,
										questions: foundQuestions
									});
								}else{
									console.log(err);
								}
							}
						)
						.sort({'_id':-1})
						.exec((err, foundQuestions) => {
							if(!err && foundQuestions){
								
							}else{
								console.log(err);
							}
						}
			
						);
					}else{
						res.render("editQuesPaper", {
							classes: foundClasses,
							exam: foundExam,
						});
					}

				}
			});

			
				
		} else {
			console.log(err);
			next(new errors.generic);
		}
	});

});

router.post("/:examId/question-paper", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var examId = req.params.examId;
	var optionString = req.body.options || "";
	var answerString = req.body.answer || "";

	var className = req.body.className;
	var subjectName = req.body.subjectName;
	var chapterName = req.body.chapterName;
	
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
						}
						else{
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
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, createdChapter) {
						if (!err && createdChapter) {
							callback(null, updatedExam,createdQuestion, createdChapter);
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
							subjectName: subjectName
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
							req.flash("success", "Question has been added Successfully");
							res.redirect("/exams/"+updatedExam._id+"/question-paper");
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

router.get("/:examId/question-paper/chooseFromQB", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var examId = req.params.examId;
	QB_Class.find({}, (err, foundClasses) => {
		if(!err && foundClasses){
			res.render("chooseFromQB", {
				classes: foundClasses,
				examId: examId,
				questions:{}
			});
		}
	});
});	

router.post('/:examId/question-paper/:username', (req, res, next) => {
    let examId = req.params.examId;
    let username = req.params.username;
    Exam.findById(examId, (err, foundExam) => {
        if(!err && foundExam) {
            let result = {
                examName: foundExam.examName,
                examTakenDate: moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a'),
                nQuestions: req.body.nQuestions ,
                nQuestionsAttempted: req.body.nQuestionsAttempted ,
                nQuestionsAnswered: req.body.nQuestionsAnswered ,
                nQuestionsUnanswered: req.body.nQuestionsUnanswered ,
                nQuestionsUnAttempted: req.body.nQuestionsUnAttempted ,
                nCorrectAns: req.body.nCorrectAns ,
                nIncorrectAns: req.body.nIncorrectAns ,
                mTotal: req.body.mTotal ,
			};

            User.findOne(
                {username: username}
            )
                .populate(
                    {
                        path:'profile',
                        model: 'Profile'
                    }
                )
                .exec((err, foundUser) => {
                    if(!err && foundUser){
                        Result.create(result, (err, createdResult) => {
                            if(!err && createdResult){
                                Profile.findByIdAndUpdate(
                                    foundUser.profile._id,
                                    {
                                        $addToSet:{
                                            results: createdResult._id
                                        }
                                    }, {
                                        upsert: true,
                                        new: true,
                                        setDefaultsOnInsert: true
                                    },
                                    (err, updatedProfile) => {
                                        if(!err && updatedProfile){
                                            res.json(
                                                {
                                                    success: true,
                                                    msg: "Your result has been saved successfully",
                                                    result: createdResult
                                                }
                                            );
                                        }
                                    }
                                )
                            }else{
                                console.log(err);
                                next(new errors.generic);
                            }
                        });
                    }
                });
        }else{
            console.log(err);
            next(new errors.generic);
        }
    });


});

router.post("/:examId/question-paper/chooseFromQB", middleware.isLoggedIn, middleware.isAdmin, (req, res, next) => {
	var examId = req.params.examId;
	var questionsIdString = req.body.questions || "";
	
	if(typeof(req.body.questions) == typeof("")){
		questionsIdString = [];
		questionsIdString.push(req.body.questions || "");
	}

	var questions = []
	for(var i = 0; i < questionsIdString.length; i++){
		if(questionsIdString[i] != '')
			questions.push(questionsIdString[i]);
	}

	async.waterfall(
		[
			function(callback){
				Exam.findById(examId, (err, foundExam) => {
					if(!err && foundExam){
						if (foundExam.questionPaper && foundExam.questionPaper != null) {
							async.waterfall(
								[
									function(callback){
										QuestionPaper.findByIdAndUpdate(foundExam.questionPaper, {
											$addToSet: {
												questions:{$each: questions}
											}
										}, {
											upsert: true,
											new: true,
											setDefaultsOnInsert: true
										},
										(err, foundQuestionPaper) => {
											if(!err && foundQuestionPaper){
												callback(null, foundQuestionPaper);
											}else{
												callback(err)
											}
										});
									},
									function(foundQuestionPaper, callback){
										foundExam.questionPaper = foundQuestionPaper._id;
										foundExam.save((err, updatedExam) => {
											if (!err && updatedExam) {
												req.flash("success", "Questions added Successfully");
												res.redirect("/exams/"+ foundExam._id +"/question-paper");
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
						}else{
							async.waterfall(
								[
									function(callback){
										var questionPaperData = {
											questions: questions
										};
										QuestionPaper.create(questionPaperData, (err, createdQuestionPaper) => {
											if (!err && createdQuestionPaper) {
												callback(null, createdQuestionPaper);
											}
											else{
												callback(err);
											}
										});
									},
									function(createdQuestionPaper, callback){
										foundExam.questionPaper = createdQuestionPaper._id;
										foundExam.save((err, updatedExam) => {
											if (!err && updatedExam) {
												req.flash("success", "Questions added Successfully");
												res.redirect("/exams/"+ foundExam._id +"/question-paper");
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


//giving question paper of particular exam
router.get("/:username/exams/:examId/questionPaper", (req, res, next) => {
    //TODO: filter exams, provide only those exams of the batch in which user belongs
	var examId = req.params.examId;
	Exam
        .findById(examId)
        .populate({
            path:"questionPaper",
            model:"QuestionPaper",
            populate:{
                path:"questions",
                model:"Question"
            }
        })
        .exec((err, foundExam) => {
            if(!err && foundExam){
                var questionPaper = {};
                questionPaper._id = foundExam.questionPaper._id;
                questionPaper.__v = foundExam.questionPaper.__v;
                questionPaper.positiveMarks = foundExam.positiveMarks;
                questionPaper.negativeMarks = foundExam.negativeMarks;
                questionPaper.totalTime = foundExam.totalTime;
                questionPaper.questions = foundExam.questionPaper.questions;

                res.json({questionPaper});
            }else{
                console.log(err);
            }
        });
});

//Giving exam list 
router.get("/:username/exams", (req, res, next) => {
	Exam.find({}, (err, foundExams) => {
		if(!err && foundExams){
			res.json({exams:foundExams});
		}else{
			console.log(err);
		}
	});
});

module.exports = router;


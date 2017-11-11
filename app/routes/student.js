var express = require("express"),
  passport = require("passport"),
  async = require("async"),
  User = require("../models/User.js"),
  Class = require("../models/Class.js"),
  Chapter = require("../models/Chapter.js"),
  Subject = require("../models/Subject"),
  Topic = require("../models/Topic.js"),
  Batch = require("../models/Batch.js"),
  Progress = require("../models/Progress.js"),
  Profile = require("../models/Profile.js"),
  errors = require("../error"),
  router = express.Router();
mongoose = require("mongoose");

//Handle user detail update
router.put("/:username", (req, res, next) => {
	var username = req.body.username || "";
	var batchName = req.body.batch || "";
	var password = req.body.password || null;

	Batch.findOne({
		batchName: batchName
	}, (err, foundBatch) => {
		if (!err && foundBatch) {
			User.findOne({
					username: username
				}, (err, foundUser) => {
					if (!err && foundUser) {} else {
						res.sendStatus(400);
						console.log(err);
					}
				})
				.populate({
					path: "profile",
					model: "Profile"
				})
				.exec((err, foundUser) => {
					if (!err && foundUser) {
						//
						let subjectId = foundBatch.subjects;
						Subject.find({
								_id: {
									$in: subjectId
								}
							},
							function (err, foundSubjects) {
								if (!err && foundSubjects) {
									var progresses = [];
									var counter = 0;
									foundSubjects.forEach((subject, subjectIndex) => {
										var chapterIds = subject.chapters;
										counter += chapterIds.length;
										chapterIds.forEach((chapterId, chapterIndex) => {
											var newProg = {
												chapter: chapterId
											};
											Progress.create(newProg, (err, createdProgress) => {
												if (!err && createdProgress) {
													progresses.push(createdProgress);
													if (subjectIndex === foundSubjects.length - 1 && chapterIndex === chapterIds.length - 1 && progresses.length === counter) {
														Profile.findByIdAndUpdate(
															foundUser.profile._id, {
																$set: {
																	batch: foundBatch._id,
																	progresses: progresses
																}
															}, {
																upsert: false,
																new: true
															},
															(err, updatedProfile) => {
																if (!err && updatedProfile) {
																	var userDetail = {
																		username,
																		password,
																		batch: batchName
																	};

																	res.json(userDetail);
																} else {
																	res.sendStatus(400);
																	console.log(err);
																}
															}
														);
													}
												} else {
													console.log('err', err);
												}
											});
										});
									});
								} else {
									console.log(err);
									callback(err);
								}
							}
						);
						//

					}
				});
		} else {
			res.sendStatus(400);
			console.log(err);
		}
	});
});

//Handle user login -- for student
router.post("/login", passport.authenticate("local"), function (req, res) {
	res.json(req.user);
});

//Handle login with email
router.post("/loginWithEmail", (req, res, next) => {
	var emailId = req.body.username;
	var index = emailId.indexOf("@");
	var username = emailId.substring(0, index);
	var password = Math.floor(Math.random() * 89999 + 10000) + "";

	// find details of the user
	User.findOne({
			username: username
		})
		.populate({
			path: "profile",
			model: "Profile",
			populate: {
				path: "batch",
				model: "Batch"
			}
		})
		.exec(function (err, foundUser) {
			if (!err && foundUser) {
				let userDetail = {
					username,
					password,
					batch: ''
				};

				if(foundUser.profile.batch && foundUser.profile.batch.batchName){
					userDetail.batch = foundUser.profile.batch.batchName;
				}

				res.json(userDetail);
			} else if (foundUser == null) {
				//
				async.waterfall(
					[
						function (callback) {
							User.register(
								new User({
									username: username
								}),
								password,
								function (err, user) {
									if (err) {
										console.log(err);
										callback(err);
									} else if (user && !err) {
										callback(null, user);
									}
								}
							);
						},
						function (user, callback) {
							var newProfile = {
								fullName: username,
								emailId: emailId
							};

							// if registered successfully create profile
							Profile.create(newProfile, function (err, createdProfile) {
								if (!err && createdProfile) {
									callback(null, user, createdProfile);
								} else {
									callback(err);
								}
							});
						},
						function (user, createdProfile, callback) {
							User.findOneAndUpdate({
									_id: user._id
								}, {
									$set: {
										profile: createdProfile
									}
								}, {
									upsert: true,
									new: true,
									setDefaultsOnInsert: true
								},
								function (err, updatedUser) {
									if (!err && updatedUser) {
										let userDetail = {
											username,
											password,
											batch: ""
										};
										res.json(userDetail);
									} else {
										callback(err);
									}
								}
							);
						}
					],
					function (err, result) {
						if (err) {
							res.sendStatus(400);
							console.log(err);
							next(new errors.generic());
						} else {}
					}
				);
			} else {
				res.sendStatus(400);
				console.log(err);
			}
		});
});

//Handle user registration-- for student->Mobile interface
router.post("/signup", function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var fullName = req.body.fullName;
	var emailId = req.body.emailId;
	var phone = req.body.phone;
	var batchName = req.body.batch || "";

	//for the student who are enrolled in any batch
	if (batchName && batchName.length > 0) {
		//find batch
		async.waterfall(
			[
				function (callback) {
					Batch.findOne({
							batchName: batchName
						},
						function (err, foundBatch) {
							if (!err && foundBatch) {
								callback(null, foundBatch);
							} else {
								callback(err);
							}
						}
					);
				},
				function (callback) {
					User.register(
						new User({
							username: username
						}),
						password,
						function (err, user) {
							if (err) {
								console.log(err);
								req.flash("error", err.message);
								return res.redirect("/student/signup");
							} else if (user && !err) {
								callback(null, user);
							}
						}
					);
				},
				function (user, callback) {
					var newProfile = {
						fullName,
						emailId,
						phone,
						batch: foundBatch._id
					};

					// if registered successfully create profile
					Profile.create(newProfile, function (err, createdProfile) {
						if (!err && createdProfile) {
							callback(null, user, createdProfile);
						} else {
							callback(err);
						}
					});
				},
				function (user, createdProfile, callback) {
					User.findOneAndUpdate({
							_id: user._id
						}, {
							$set: {
								profile: createdProfile
							}
						}, {
							upsert: true,
							new: true,
							setDefaultsOnInsert: true
						},
						function (err, updatedUser) {
							if (!err && updatedUser) {
								callback(null, createdProfile, updatedUser);
							} else {
								callback(err);
							}
						}
					);
				},
				function (createdProfile, updatedUser, callback) {
					passport.authenticate("local")(req, res, function () {
						User.findOne({
								_id: updatedUser._id
							})
							.populate({
								path: "profile",
								model: "Profile",
								populate: {
									path: "batch",
									model: "Batch"
								}
							})
							.exec(function (err, foundUser) {
								if (!err && foundUser) {
									res.json(foundUser);
								} else {
									console.log(err);
								}
							});
					});
				}
			],
			function (err, result) {
				if (err) {
					console.log(err);
					next(new errors.generic());
				} else {}
			}
		);
	}
});

//User Register form-- student->from web interface
router.get("/register", function (req, res) {
	res.render("studentRegister", {
		error: res.locals.msg_error[0]
	});
});

//Handle User Register form-- student->from web interface
router.post("/register", function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var fullName = req.body.fullName;
	var emailId = req.body.emailId;
	var phone = req.body.phone;
	var batchName = req.body.batch || "";

	async.waterfall(
		[
			function (callback) {
				User.register(
					new User({
						username: username
					}),
					password,
					function (err, user) {
						if (err) {
							console.log(err);
							req.flash("error", err.message);
							return res.redirect("/student/register");
						} else if (user && !err) {
							callback(null, user);
						}
					}
				);
			},
			function (user, callback) {
				var newProfile = {
					fullName,
					emailId,
					phone
				};

				// if registered successfully create profile
				Profile.create(newProfile, function (err, createdProfile) {
					if (!err && createdProfile) {
						callback(null, user, createdProfile);
					} else {
						callback(err);
					}
				});
			},
			function (user, createdProfile, callback) {
				User.findOneAndUpdate({
						_id: user._id
					}, {
						$set: {
							profile: createdProfile
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, updatedUser) {
						if (!err && updatedUser) {
							callback(null, createdProfile, updatedUser);
						} else {
							callback(err);
						}
					}
				);
			},
			function (createdProfile, updatedUser, callback) {
				passport.authenticate("local")(req, res, function () {
					User.findOne({
							_id: updatedUser._id
						})
						.populate({
							path: "profile",
							model: "Profile"
						})
						.exec(function (err, foundUser) {
							if (!err && foundUser) {
								req.flash(
									"success",
									"Successfully signed you in as " + req.body.username
								);
								res.redirect("/");
							} else {
								console.log(err);
							}
						});
				});
			}
		],
		function (err, result) {
			if (err) {
				console.log(err);
				next(new errors.generic());
			} else {}
		}
	);
});

router.get("/:username/subjects", function (req, res) {
	var subjects = {};
	User.findOne({
				username: req.params.username
			},
			function (err, foundUser) {
				if (!err && foundUser) {} else if (err) {
					console.log(err);
				}
			}
		)
		.populate({
			path: "profile",
			model: "Profile",
			populate: {
				path: "batch",
				model: "Batch",
				populate: {
					path: "subjects",
					model: "Subject",
					populate: {
						path: "chapters",
						model: "Chapter",
						populate: {
							path: "topics",
							model: "Topic",
							populate: {
								path: "files",
								model: "File"
							}
						}
					}
				}
			}
		})
		.exec(function (err, userDetail) {
			if (!err && userDetail) {
				subjects = userDetail.profile.batch.subjects;
				res.json({
					subjects: subjects
				});
			} else {}
		});
});

router.get('/:username/results', function(req, res, next) {
    let username = req.params.username;
    User.findOne(
            {username: username}
        )
        .populate(
            {
                path:'profile',
                model:'Profile',
                populate:{
                    path:'results',
                    model:'Result'
                }
            }
        )
        .exec((err, foundUser) => {
            if(!err && foundUser){
                res.json({ results: foundUser.profile.results});
            }
        });
});

router.get("/:username/progresses", (req, res, next) => {
	User.findOne({
				username: req.params.username
			},
			function (err, foundUser) {
				if (!err && foundUser) {} else if (err) {
					console.log(err);
				}
			}
		)
		.populate({
			path: "profile",
			model: "Profile",
			populate: {
				path: "progresses",
				model: "Progress"
			}
		})
		.exec(function (err, foundUser) {
			if (!err && foundUser) {
				progresses = foundUser.profile.progresses;
				res.json({
					progresses: progresses
				});
			}
		});
});

//create /update progress of particular chapter
router.put("/:username/chapters/:chapterId", (req, res, next) => {
	var username = req.params.username;
	var chapterId = req.params.chapterId;
	var completed = req.body.completed;
	var status = req.body.status;
	var topics = req.body.topics;

	User.findOne({
				username: username
			},
			function (err, foundUser) {
				if (!err && foundUser) {} else if (foundUser == null) {
					res.sendStatus(400);
				} else {
					res.sendStatus(400);
					console.log(err);
				}
			}
		)
		.populate({
			path: "profile",
			model: "Profile"
		})
		.exec(function (err, foundUser) {
			if (!err && foundUser) {
				Progress.findOneAndUpdate({
						chapter: chapterId
					}, {
						$set: {
							completed: completed,
							status: status,
							topics: topics
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, updatedProg) {
						if (!err && updatedProg) {
							Profile.findByIdAndUpdate(
								foundUser.profile, {
									$addToSet: {
										progresses: updatedProg
									}
								}, {
									upsert: true,
									new: true,
									setDefaultsOnInsert: true
								},
								function (err, updatedProfile) {
									if (!err && updatedProfile) {
										console.log("updatedProg", updatedProg);
										res.json({
											updatedProg: updatedProg
										});
									} else {
										res.sendStatus(400);
										console.log(400);
									}
								}
							);
						} else {
							res.sendStatus(400);
							console.log(400);
						}
					}
				);
			} else {
				res.sendStatus(400);
				console.log(400);
			}
		});
});

//sending classes list
router.get("/classes", function (req, res, next) {
	Class.find({}, function (err, classes) {
			if (err) {
				console.log(err);
				next(new errors.notFound());
			}
		})
		.populate({
			path: "subjects",
			model: "Subject",
			populate: {
				path: "chapters",
				model: "Chapter",
				populate: {
					path: "topics",
					model: "Topic",
					populate: {
						path: "files",
						model: "File"
					}
				}
			}
		})
		.exec(function (err, classes) {
			if (err) {
				console.log(err);
			} else {
				res.type("application/json");
				res.json({
					classes: classes
				});
			}
		});
});

module.exports = router;
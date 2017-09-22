var express = require("express"),
	passport = require("passport"),
	async = require("async"),	

	User = require("../models/User.js"),
	Class = require("../models/Class.js"),
	Chapter = require("../models/Chapter.js"),
	Batch = require("../models/Batch.js"),
	Progress = require("../models/Progress.js"),
	Profile = require("../models/Profile.js"),
	errors = require("../error"),

	router = express.Router();


//User login form-- admin
router.get("/login", function (req, res) {
	res.render("studentSignup",{
		error: res.locals.msg_error[0]
	});
});

//Handle user login -- for student
router.post("/login", passport.authenticate("local", {
		failureRedirect: "/student/login",
		successFlash: "Welcome back",
		failureFlash: true
	}),
	function (req, res) {
		res.status(200).json(req.user);
	}
);



//Handle user registration-- for student->Mobile interface
router.post("/signup", function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var fullName = req.body.fullName;
	var emailId = req.body.emailId;
	var phone = req.body.phone;
	var batchName = req.body.batch || "";

	//for the student who are enrolled in any batch
	if(batchName && batchName.length > 0){
		//find batch
		async.waterfall(
			[
				function(callback){
					Batch.findOne({
						batchName: batchName
					},
					function (err, foundBatch) {
						if (!err && foundBatch) {
							callback(null, foundBatch);
						}else{
							callback(err);
						}
						
					});
				},
				function(foundBatch, callback){
					User.register(new User({
						username: username
					}), password, function (err, user) {
						if (err) {
							console.log(err);
							req.flash("error", err.message);
							return res.redirect("/student/signup");
							
						}else if (user && !err) {
							callback(null,foundBatch, user);
						}
					});
				},
				function(foundBatch, user, callback){
					var newProfile = {
						fullName,
						emailId,
						phone,
						batch: foundBatch._id
					};

					// if registered successfully create profile
					Profile.create(
						newProfile,
						function (err, createdProfile) {
							if (!err && createdProfile) {
								callback(null, foundBatch, user, createdProfile);
							}else{
								callback(err);
							}
						});
				},
				function(foundBatch, user, createdProfile, callback){
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
							callback(null, foundBatch, createdProfile, updatedUser);
						}else{
							callback(err);
						}
					});
				},
				function(foundBatch, createdProfile, updatedUser, callback){
					passport.authenticate("local")(req, res, function () {
						User.findOne({
							_id: updatedUser._id
						}).populate({
							path: "profile",
							model: "Profile",
							populate: {
								path: "batch",
								model: "Batch"
							}
						}).exec(function (err, foundUser) {
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
					next(new errors.generic);
				} else {
	
				}
			}
		);
	}
});

//User Register form-- student->from web interface
router.get("/register", function (req, res) {
	res.render("studentRegister",{
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
			function(callback){
				User.register(new User({
					username: username
				}), password, function (err, user) {
					if (err) {
						console.log(err);
						req.flash("error", err.message);
						return res.redirect("/student/register");
						
					}else if (user && !err) {
						callback(null, user);
					}
				});
			},
			function(user, callback){
				var newProfile = {
					fullName,
					emailId,
					phone
				};

				// if registered successfully create profile
				Profile.create(
					newProfile,
					function (err, createdProfile) {
						if (!err && createdProfile) {
							callback(null, user, createdProfile);
						}else{
							callback(err);
						}
					});
			},
			function(user, createdProfile, callback){
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
					}else{
						callback(err);
					}
				});
			},
			function(createdProfile, updatedUser, callback){
				passport.authenticate("local")(req, res, function () {
					User.findOne({
						_id: updatedUser._id
					}).populate({
						path: "profile",
						model: "Profile"
					}).exec(function (err, foundUser) {
						if (!err && foundUser) {
							req.flash("success","Successfully signed you in as "+ req.body.username);
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
				next(new errors.generic);
			} else {

			}
		}
	);
});


router.get("/:username/subjects", function (req, res) {
	var subjects = {};
	User.findOne({
				username: req.params.username
			},
			function (err, foundUser) {
				if (!err && foundUser) {

				} else if (err) {
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
		}).exec(function (err, userDetail) {
			if (!err && userDetail) {
				subjects = userDetail.profile.batch.subjects;
				res.json({
					"subjects": subjects,
				});
			}
			else{

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
				model: "Progress",
			}
		}).exec(function (err, foundUser) {
			if (!err && foundUser) {
				progresses = foundUser.profile.progresses;
				res.json({
					"progresses": progresses
				});
			}
		});
});


//create /update progress of particular chapter
router.post("/:username/chapters/:chapterId/:completed/:status", (req, res, next) => {
	var username = req.params.username;
	var chapterId = req.params.chapterId;
	var completed = req.params.completed;
	var status = req.params.status;

	User.findOne({
				username: req.params.username
			},
			function (err, foundUser) {
				if (!err && foundUser) {
					console.log(foundUser);

				} else if (err) {
					console.log(err);
				}
			}
		)
		.populate({
			path: "profile",
			model: "Profile",
		})
		.exec(function (err, foundUser) {
			if (!err && foundUser) {
				Progress.findOneAndUpdate({
						chapter: chapterId
					}, {
						$set: {
							completed: completed,
							status: status
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, updatedProg) {
						if (!err && updatedProg) {
							Profile.findByIdAndUpdate(foundUser.profile, {
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
										res.json({
											"updatedProg": updatedProg
										});
									}
								});

						} else {
							console.log(err);
						}
					});

			} else {

			}
		});


});



//sending classes list
router.get("/classes", function (req, res, next) {

	Class.find({}, function (err, classes) {
			if (err) {
				console.log(err)
				next(new errors.notFound);
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
				console.log(err)
			} else {
				res.type('application/json');
				res.json({
					"classes": classes
				});
			}
		});

});

module.exports = router;


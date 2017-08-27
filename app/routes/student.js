var express = require("express"),
	passport = require("passport"),

	User = require("../models/User.js"),
	Class = require("../models/Class.js"),
	Batch = require("../models/Batch.js"),
	Profile = require("../models/Profile.js"),
	errors = require("../error"),

	router = express.Router();

//User login form-- admin
router.get("/login", function (req, res) {
	res.json({
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

//User logout-- student
router.get("/logout", function (req, res) {
	req.logout();
	res.json({
		"success": "You Logged out successfully"
	});
});

//Handle user registration-- for student
//TODO: Update it with async methods [waterfall]
router.post("/signup", function (req, res) {
	var fullName = req.body.fullName;
	var emailId = req.body.emailId;
	var phone = req.body.phone;
    var batchName = req.body.batch;
    
    //find batch
	Batch.findOne({
			batchName: batchName
		},
		function (err, foundBatch) {
			if (!err && foundBatch) {
                //if found register user with given credentials
				User.register(new User({
					username: req.body.username
				}), req.body.password, function (err, user) {
					if (err) {
						console.log(err);
						return res.json(err);
					} else if (user && !err) {
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
										function (err) {
											if (!err) {
												passport.authenticate("local")(req, res, function () {
													User.findOne({
														_id: user._id
													}).populate({
														path: "profile",
														model: "Profile",
														populate: {
															path: "batch",
															model: "Batch"
														}
													}).exec(function (err, foundUser) {
														if (!err && foundUser) {
															res.status(200).json(foundUser);
														} else {
															res.json(user);
														}
													});
												});
											} else {
												console.log(err);
												var errors = {
													name: "couldn't update the profile",
													message: "Error while updating profile"
												};
												return res.send(errors);
											}
										}
									);

								} else {
									console.log(err);
									var errors = {
										name: "couldn't create the profile",
										message: "Error while creating profile"
									};
									return res.send(errors);
								}
							}
						);

					}
				});

			} else {
				console.log(err);
				var errors = {
					name: "batchNotFound",
					message: "No batch found with given batch name"
				};
				return res.send(errors);
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
		}).exec(function (err, userDetail) {
			if (!err && userDetail) {
				subjects = userDetail.profile.batch.subjects;
				res.json({
					"subjects": subjects
				});
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


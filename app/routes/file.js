var express = require("express"),
	path = require('path'),
	multer = require('multer'),
	moment = require("moment-timezone"),
	async = require("async"),
	fs = require('fs'),

	File = require("../models/File.js"),
	Topic = require("../models/Topic.js"),
	Chapter = require("../models/Chapter.js"),
	Subject = require("../models/Subject.js"),
	Class = require("../models/Class.js"),
	middleware = require("../middleware"),
	errors = require("../error"),
	router = express.Router();

//file uplaod helper
//setting disk storage for uploaded files
var storage = multer.diskStorage({
	destination: __dirname + "/../../../uploads/",
	filename: function (req, file, callback) {
		callback(null, Date.now() + "__" + file.originalname);
	}
});

//file uplaod helper
function fileUploadError(req, res, next) {
	//deleting uploaded file from upload directory
	fs.unlink(req.file.path, function (err) {
		if (err) {
			console.log(err);
			next(new errors.generic);
		} else console.log("file deleted from uploads directory");
	});
}

//file uplaod helper
function fileUploadSuccess(req, res) {
	req.flash("success", req.file.originalname + " uploaded successfully");
	res.redirect("/files/uploadFile");
}

//Form for uploading a file
router.get('/uploadFile', middleware.isLoggedIn, middleware.isAdmin, function (req, res, next) {
	Class.find({}, function (err, classes) {
			if (err) console.log(err);
		})
		.populate({
			path: "subjects",
			model: "Subject",
		})
		.exec(function (err, classes) {
			if (err) {
				console.log(err);
				req.flash("error", "Please try again");
				res.redirect("/files/uploadFile");
			} else {
				res.render('uploadFile', {
					classes: classes
				});
			}
		});
});

//Handle file upload
router.post('/uploadFile', middleware.isLoggedIn, middleware.isAdmin, function (req, res) {
	var upload = multer({
		storage: storage
	}).single('userFile');
	upload(req, res, function (err) {
		var fileName = req.file.originalname;
		var fileType = path.extname(req.file.originalname);
		var filePath = req.file.path;
		var uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
		var fileSize = req.file.size;
		var className = req.body.className;
		var subjectName = req.body.subjectName;
		var chapterName = req.body.chapterName;
		var chapterDescription = req.body.chapterDescription;
		var topicName = req.body.topicName;
		var topicDescription = req.body.topicDescription;

		var newFile = {
			fileName,
			fileType,
			filePath,
			uploadDate,
			fileSize,
			className,
			subjectName,
			chapterName,
			topicName,
		};

		async.waterfall(
			[
				function (callback) {
					File.create(newFile, function (err, createdFile) {
						if (!err && createdFile) {
							callback(null, createdFile);
						} else {
							console.log(err);
							callback(err);
						}
					});
				},
				function (createdFile, callback) {
					Topic.findOneAndUpdate({
							topicName: topicName
						}, {
							$addToSet: {
								files: createdFile
							},
							$set: {
								topicName: topicName,
								topicDescription: topicDescription
							}
						}, {
							upsert: true,
							new: true,
							setDefaultsOnInsert: true
						},
						function (err, createdTopic) {
							if (!err && createdTopic) {
								callback(null, createdTopic);
							} else {
								console.log(err);
								callback(err);
							}
						}
					);
				},
				function (createdTopic, callback) {
					Chapter.findOneAndUpdate({
							chapterName: chapterName
						}, {
							$addToSet: {
								topics: createdTopic
							},
							$set: {
								chapterName: chapterName,
								chapterDescription: chapterDescription
							}
						}, {
							upsert: true,
							new: true,
							setDefaultsOnInsert: true
						},
						function (err, createdChapter) {
							if (!err && createdChapter) {
								callback(null, createdChapter);
							} else {
								console.log(err);
								callback(err);
							}
						}
					);
				},
				function (createdChapter, callback) {
					Subject.findOneAndUpdate({
							subjectName: subjectName
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
								callback(null, createdSubject);

							} else {
								console.log(err);
								callback(err);
							}
						}
					);
				},
				function (createdSubject, callback) {
					Class.findOneAndUpdate({
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
								fileUploadSuccess(req, res);
							} else {
								console.log(err);
								callback(err);
							}
						}
					);
				}
			],
			function (err, result) {
				if (err) {
					console.log(err);
					fileUploadError(req, res);
				}
			}
		);

	});
});

router.get("/:fileId", function (req, res, next) {
	File.findById(req.params.fileId, function (err, foundFile) {
		if (err) {
			console.log(err);
			next(new errors.notFound);
		} else {
			res.download(foundFile.filePath, foundFile.fileName, function (err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
});

module.exports = router;


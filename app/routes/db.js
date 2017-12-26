var express = require("express"),
	router = express.Router(),
	mongoose = require("mongoose"),
	errors = require("../error"),
	pluralize = require("pluralize"),
	moment = require("moment-timezone"),
	async = require("async"),
	fs = require("fs"),
	File = require("../models/File.js"),
	Topic = require("../models/Topic.js"),
	Chapter = require("../models/Chapter.js"),
	Subject = require("../models/Subject.js"),
	Class = require("../models/Class.js"),
	User = require("../models/User.js"),
	Assignment = require("../models/Assignment.js"),
	Exam = require("../models/Exam.js"),
	Batch = require("../models/Batch.js"),
	Gallery = require("../models/Gallery"),
    Profile = require("../models/Profile.js"),
    path = require('path'),
	multer = require('multer'),
	fs = require('fs'),
	middleware = require("../middleware");

//TODO: This is where all the uploaded images are stored
var storage = multer.diskStorage({
	destination: __dirname + "/../../../HarvinDb/img",
	filename: function(req, file, callback) {
		callback(null, Date.now() + "__" + file.originalname);
	}
});

router.get("/", (req, res, next) => {
	res.render("dbCollection");
});

router.get(
	"/users",
	middleware.isLoggedIn,
	middleware.isAdmin,
	(req, res, next) => {
		User.find({})
			.populate({
				path: "profile",
				model: "Profile",
				populate: {
					path: "batch",
					model: "Batch"
				}
			})
			.exec((err, foundUsers) => {
				if (!err && foundUsers) {
					res.render("userProfileDb", { users: foundUsers });
				} else {
					console.log(err);
					next(new errors.generic());
				}
			});
	}
);

router.get(
	"/exams",
	middleware.isLoggedIn,
	middleware.isAdmin,
	(req, res, next) => {
		Exam.find({})
			.populate({
				path: "batch",
				model: "Batch"
			})
			.exec((err, foundExams) => {
				if (!err && foundExams) {
					res.render("examDb", { exams: foundExams });
				} else {
					console.log(err);
					next(new errors.generic());
				}
			});
	}
);

router.get(
	"/files",
	middleware.isLoggedIn,
	middleware.isAdmin,
	(req, res, next) => {
		File.find({})
			.populate({
				path: "class",
				model: "Class"
			})
			.populate({
				path: "subject",
				model: "Subject"
			})
			.populate({
				path: "chapter",
				model: "Chapter"
			})
			.populate({
				path: "topic",
				model: "Topic"
			})
			.exec((err, foundFiles) => {
				if (!err && foundFiles) {
					res.render("fileDb", { files: foundFiles });
				} else {
					console.log(err);
					next(new errors.generic());
				}
			});
	}
);

//TODO: This renders the form to upload image
router.get("/gallery", (req, res, next) => {
	res.render("insertGallery");
});

//TODO: It handels the post request to upload image
router.post("/gallery", (req, res, next) => {
    var upload = multer({
		storage: storage
    }).single('userFile');
    
    upload(req, res, function (err) {
        var fileName = req.file.originalname;
        
        //absolute file path
        var filePath = req.file.path;
        var srcList = filePath.split(path.sep);

        //relative file path (required by ejs file)

        var src = path.join('/', srcList[srcList.length-2], srcList[srcList.length-1]);
        
		var uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
		var description = req.body.description;
        var category = req.body.category;
        
        var newFile = {
            fileName,
            src,
            uploadDate,
            description,
            category,
            filePath
        };

        Gallery.create(newFile, (err, createdFile) => {
            if (!err && createdFile) {
                req.flash("success", fileName + " uploaded successfully");
                res.redirect('/db/gallery');
            } else {
                console.log('err:', err);
                req.flash("error", "Couldn't upload the image");
                res.redirect('/db/gallery');
            }
        });
	});
});

module.exports = router;

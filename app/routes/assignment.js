var express = require("express"),
	async = require("async"),
	path = require('path'),
	multer = require('multer'),
	moment = require("moment-timezone"),
	fs = require('fs'),

	Assignment = require("../models/Assignment"),
	errors = require("../error"),
	middleware = require("../middleware"),

	router = express.Router();

//assignment uplaod helper
//setting disk storage for uploaded assignment
var storage = multer.diskStorage({
	destination: __dirname + "/../../../assignments/",
	filename: function (req, file, callback) {
		callback(null, Date.now() + "__" + file.originalname);
	}
});

//assignment uplaod helper
function assignmentUploadError(req, res, next) {
	//deleting uploaded file from upload directory
	fs.unlink(req.file.path, function (err) {
		if (err) {
			console.log(err);
			next(new errors.generic);
		} else console.log("assignment deleted from assignment directory");
	});
}

//file uplaod helper
function assignmentUploadSuccess(req, res) {
	req.flash("success", req.file.originalname + " uploaded successfully");
	res.redirect("/assignment/uploadAssignment");
}

router.get('/uploadAssignment', (req, res, next) => {
	res.render('newAssignment');
});

router.post('/uploadAssignment', function (req, res, next) {
	var upload = multer({
		storage: storage
	})
	.single('userFile');

	upload(req, res, function(err){
		
		var assignmentName = req.body.assignmentName;
		var uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
		var lastSubDate = req.body.lastSubDate;
		var filePath = req.file.path;



		var newAssignment = {
			assignmentName,
			uploadDate,
			lastSubDate,
			filePath
		};

		Assignment.create(newAssignment, (err, createdAsssignment) =>{
			if (!err && createdAsssignment) {
				assignmentUploadSuccess(req, res);
			} else {
				console.log(err);
				assignmentUploadError(req, res, next);
			}
		});
	});
});

router.get('/:username/assignments', (req, res, next) => {
	Assignment.find({}, (err, foundAssignments) => {
		if (!err && foundAssignments) {
			res.send({assignments: foundAssignments});
		} else {
			console.log(err);
			res.sendStatus(400);
		}
	});
});

router.get('/:assignmentId', (req, res, next) => {
	var assignmentId = req.params.assignmentId;
	Assignment.findById(assignmentId, function (err, foundAssignment) {
		if (err) {
			console.log(err);
			res.sendStatus(404);
		} else if(!err && foundAssignment) {
			res.download(foundAssignment.filePath, foundAssignment.fileName, function (err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
});

module.exports = router;


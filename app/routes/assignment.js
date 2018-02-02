var express = require("express"),
  async = require("async"),
  path = require('path'),
  multer = require('multer'),
  moment = require("moment-timezone"),
  fs = require('fs'),
  Assignment = require("../models/Assignment"),
	Batch = require("../models/Batch"),
  Center = require("../models/Center"),
  errors = require("../error"),
  middleware = require("../middleware"),

  router = express.Router();

//assignment uplaod helper
//setting disk storage for uploaded assignment
var storage = multer.diskStorage({
  destination: __dirname + "/../../../assignments/",
  filename: function(req, file, callback) {
    callback(null, Date.now() + "__" + file.originalname);
  }
});

//assignment uplaod helper
function assignmentUploadError(req, res, next) {
  //deleting uploaded file from upload directory
  fs.unlink(req.file.path, function(err) {
    if (err) {
      console.log(err);
      next(new errors.generic);
    } else console.log("assignment deleted from assignment directory");
  });
}

//file uplaod helper
function assignmentUploadSuccess(req, res) {
  req.flash("success", req.file.originalname + " uploaded successfully");
  res.redirect("/admin/assignment/uploadAssignment");
}

router.get('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  Assignment.find({atCenter: req.user._id})
    .populate({
      path: 'batch',
      model: 'Batch'
    })
    .exec((err, foundAssignments) => {
      if (!err && foundAssignments) {
        res.render("assignments", {
          foundAssignments: foundAssignments
        });
      } else {
        console.log(err);
        next(new errors.generic);
      }
    });
});

router.get('/uploadAssignment', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  Batch.find({atCenter: req.user._id}, (err, foundBatches) => {
    if (!err && foundBatches) {
      res.render("newAssignment", {
        batches: foundBatches
      });
    } else {
      console.log('error', err);
      next(new errors.generic());
    }
  });
});

router.post('/uploadAssignment', middleware.isLoggedIn, middleware.isCentreOrAdmin, function(req, res, next) {
  var upload = multer({
      storage: storage
    })
    .single('userFile');

  upload(req, res, function(err) {
    console.log('body', req.body);
    console.log('file', req.file);

    var assignmentName = req.body.assignmentName;
    var uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
    var lastSubDate = req.body.lastSubDate;
    var filePath = req.file.path;
    var batchId = req.body.batchName;

    var newAssignment = {
      assignmentName,
      uploadDate,
      lastSubDate,
      filePath
    };

    Assignment.findOneAndUpdate(newAssignment, {
        $set: {
          batch: batchId,
					atCenter: req.user._id
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      },
      (err, createdAsssignment) => {
        if (!err && createdAsssignment) {
					Center.findOneAndUpdate(req.user.username, {
						$addToSet:{
							assignments: createdAsssignment._id
						},
						$set: {
							centerName: req.user.username
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					}, function (err, updatedCenter) {
							if(!err && updatedCenter){
								assignmentUploadSuccess(req, res);
							} else{
								console.log(err);
								assignmentUploadError(req, res, next);
							}
					})
        } else {
          console.log(err);
        }
      });
  });
});

router.get("/:assignmentId/edit", middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  var assignmentId = req.params.assignmentId;

  Batch.find({atCenter: req.user._id}, (err, foundBatches) => {
    if (!err && foundBatches) {
      Assignment.findById(assignmentId)
        .populate({
          path: 'batch',
          model: "Batch"
        })
        .exec((err, foundAssignment) => {
          if (!err && foundAssignment) {
            res.render("editAssignment", {
              assignment: foundAssignment,
              batches: foundBatches
            });
          }
        })
    } else {
      console.log('error', err);
      next(new errors.generic());
    }
  });
});

router.put("/:assignmentId", middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  var assignmentId = req.params.assignmentId;
  var assignmentName = req.body.assignmentName;
  var uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
  var lastSubDate = req.body.lastSubDate;
  var batchId = req.body.batchName;

  Assignment.findByIdAndUpdate(assignmentId, {
      $set: {
        assignmentName,
        uploadDate,
        lastSubDate,
        batch: batchId,
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    },
    (err, updatedAssignment) => {
      if (!err && updatedAssignment) {
        req.flash("success", assignmentName + " updated Successfully");
        res.redirect("/admin/assignment");
      } else {
        console.log(err);
        next(new errors.generic);
      }
    }
  );
});


router.get('/:username/assignments', (req, res, next) => {
  //TODO: filter assignments, provide only those assignments of the batch in which user belongs
  Assignment.find({}, (err, foundAssignments) => {
    if (!err && foundAssignments) {
      res.send({
        assignments: foundAssignments
      });
    } else {
      console.log(err);
      res.sendStatus(400);
    }
  });
});

router.get('/:assignmentId', (req, res, next) => {
  var assignmentId = req.params.assignmentId;
  Assignment.findById(assignmentId, function(err, foundAssignment) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else if (!err && foundAssignment) {
      res.download(foundAssignment.filePath, foundAssignment.fileName, function(err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

module.exports = router;

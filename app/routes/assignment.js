const express = require("express");
const path = require('path');
const multer = require('multer');
const moment = require("moment-timezone");
const fs = require('fs');
const Assignment = require("../models/Assignment");
const Batch = require("../models/Batch");
const Center = require("../models/Center");
const errors = require("../error");
const middleware = require("../middleware");
const errorHandler = require('../errorHandler');
const validator = require('validator');
const assignmentController = require('../controllers/assignment.controller');
const batchController = require('../controllers/batch.controller');
const router = express.Router();

//assignment uplaod helper
//setting disk storage for uploaded assignment
var storage = multer.diskStorage({
  destination: __dirname + "/../../../HarvinDb/assignments/",
  filename: function (req, file, callback) {
    callback(null, Date.now() + "__" + file.originalname);
  }
});

router.get('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  try {
    var foundAssignments = await assignmentController.findAssignmentsByUserId(req.user)
    foundAssignments = await assignmentController.populateFieldOfAssignment(foundAssignments, 'batch')
    return res.render('assignments', {
      foundAssignments
    })
  } catch (e) {
    return next(e)
  }

});

router.get('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {

  try {
    const foundBatches = await batchController.findBatchByUserId(req.user)
    return res.render('newAssignment', {
      batches: foundBatches
    })
  } catch (e) {
    next(e)
  }

});

router.post('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, function (req, res, next) {

  var upload = multer({
      storage: storage
    })
    .single('userFile');

  upload(req, res, async function (err) {

    if(!req.file) return errorHandler.errorResponse('INVALID_FIELD', 'file', next)

    const filePath = req.file.path ;
    const assignmentName = req.body.assignmentName || '';
    const uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
    const lastSubDate = req.body.lastSubDate || '';
    const batchId = req.body.batchName || '';

    if(!assignmentName || validator.isEmpty(assignmentName)) return errorHandler.errorResponse('INVALID_FIELD', 'assignment name', next)
    if(!lastSubDate || validator.isEmpty(lastSubDate)) return errorHandler.errorResponse('INVALID_FIELD', 'last submission date', next)
    if(!batchId || validator.isEmpty(batchId)) return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)

    try{
      let foundBatch = await batchController.findBatchById(batchId)
      var newAssignment = {
        assignmentName,
        uploadDate,
        lastSubDate,
        filePath,
        batch: foundBatch,
        addedBy: req.user
      };

      let createdAsssignment = await assignmentController.createAssignment(newAssignment)
    } catch(e){
      next(e)
    }

});

router.get("/:assignmentId/edit", middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  var assignmentId = req.params.assignmentId;

  Batch.find({
    addedBy: req.user._id
  }, (err, foundBatches) => {
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
  Assignment.findById(assignmentId, function (err, foundAssignment) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else if (!err && foundAssignment) {
      res.download(foundAssignment.filePath, foundAssignment.fileName, function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});

module.exports = router;

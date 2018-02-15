const express = require("express");
const path = require('path');
const multer = require('multer');
const moment = require("moment-timezone");
const Async = require("async");
const fs = require('fs');
const File = require("../models/File.js");
const Topic = require("../models/Topic.js");
const Chapter = require("../models/Chapter.js");
const Subject = require("../models/Subject.js");
const Class = require("../models/Class.js");
const Center = require("../models/Center.js");
const middleware = require("../middleware");
const errors = require("../error");
const errorHandler = require('../errorHandler');
const validator = require('validator');
const fileController = require('../controllers/file.controller');
const topicController = require('../controllers/topic.controller');
const chapterController = require('../controllers/chapter.controller');
const subjectController = require('../controllers/subject.controller');
const classController = require('../controllers/class.controller');
const router = express.Router();

//file uplaod helper
//setting disk storage for uploaded files
var storage = multer.diskStorage({
  destination: __dirname + "/../../../HarvinDb/FileUploads/",
  filename: function (req, file, callback) {
    callback(null, Date.now() + "__" + file.originalname);
  }
});

//Form for uploading a file
router.get('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  res.render('uploadFile');
});

//Handle file upload
router.post('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, function (req, res, next) {
  var upload = multer({
    storage: storage
  }).single('userFile');

  upload(req, res, async function (err) {

    res.locals.flashUrl = req.originalUrl;

    const uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
    const subjectName = req.body.subjectName || '';
    const chapterName = req.body.chapterName || '';
    const chapterDescription = req.body.chapterDescription;
    const topicName = req.body.topicName || '';
    const topicDescription = req.body.topicDescription;
    const className = req.body.className || '';

    if(!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)
    if(!subjectName || validator.isEmpty(subjectName)) return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
    if(!chapterName || validator.isEmpty(chapterName)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter name', next)
    if(!topicName || validator.isEmpty(topicName)) return errorHandler.errorResponse('INVALID_FIELD', 'topic name', next)

    if (req.file) {
      const fileName = req.file.originalname;
      const fileType = path.extname(req.file.originalname);
      const filePath = req.file.path;
      const fileSize = req.file.size;

      var newFile = {
        fileName,
        fileType,
        filePath,
        uploadDate,
        fileSize
      };
    }

    const user = req.user

    const newTopic = {
      topicName,
      topicDescription,
    }

    const newChapter = {
      chapterName,
      chapterDescription,
    }

    const newSubject = {
      subjectName,
    }

    const newClass = {
      className,
    }

    try {
      var createdFile;
      if (newFile) {
        createdFile = await fileController.createNewFile(newFile)
      }

      if (createdFile) {
        var updatedTopic = await topicController.addFileToTopicByTopicNameAndUserId(newTopic, user, createdFile)
      } else {
        var updatedTopic = await topicController.createOrUpdateTopicByTopicNameAndUserId(newTopic, user)
      }

      var updatedChapter = await chapterController.addTopicToChapterByChapterNameAndUserId(newChapter, user, updatedTopic)
      var updatedSubject = await subjectController.addChapterToSubjectBySubjectClassAndUserId(newSubject, className, user, updatedChapter)
      var updatedClass = await classController.addSubjectToClassByClassNameAndUserId(newClass, user, updatedSubject)
      updatedSubject = await subjectController.addClassToSubjectById(updatedSubject, updatedClass)
      updatedChapter = await chapterController.addSubjectToChapterById(updatedChapter, updatedSubject)
      updatedTopic = await topicController.addChapterToTopicById(updatedTopic, updatedChapter)

      if (createdFile) {
        updatedFile = await fileController.addTopicChapterSubjectClassToFileById(createdFile, updatedTopic, updatedChapter, updatedSubject, updatedClass)
      }

      req.flash("success", "Successfully created new entries");
      res.redirect("/admin/files/new");

    } catch (e) {
      next(e)
    }

  });
});

router.get("/:fileId", async function (req, res, next) {

  const fileId = req.params.fileId || ''

  if(!fileId || !validator.isMongoId(fileId)) return errorHandler.errorResponse('INVALID_FIELD', 'File id', next)

  try{
    const foundFile = await fileController.findFileById(fileId)
    res.download(foundFile.filePath, foundFile.fileName, (err) => {
      if(err) return next(err)
    })
  } catch(e) {
    next(e)
  }
});

module.exports = router;

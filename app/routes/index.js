var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/User.js"),
    Profile = require("../models/Profile.js"),

    adminRoutes = require("./admin"),
    studentRoutes = require("./student"),
    batchRoutes = require("./batch"),
    fileRoutes = require("./file"),
    dbRoutes = require("./db"),
    examRoutes = require("./exam"),
    assignmentRoutes = require("./assignment"),
    qbRoutes = require("./questionBank"),
    resultsRoutes = require("./results"),
    vmsRoutes = require("./vms"),
    formRoutes = require('./form'),
    blogRoutes = require('./blog'),
    Topic = require("../models/Topic.js"),
    Chapter = require("../models/Chapter.js"),
    Subject = require("../models/Subject.js"),
    Class = require("../models/Class.js"),
    Gallery = require("../models/Gallery.js"),
File = require("../models/File.js");

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/admin/batches", batchRoutes);
router.use("/admin/files", fileRoutes);
router.use("/admin/db", dbRoutes);
router.use("/admin/exams", examRoutes);
router.use("/admin/assignment", assignmentRoutes);
router.use("/admin/questionBank", qbRoutes);
router.use("/admin/results", resultsRoutes);
router.use( vmsRoutes);
router.use('/admin/blog', blogRoutes);


router.delete('/users/:userId', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId, (err, foundUser) => {
    if (!err && foundUser) {
      if (foundUser.profile) {
        const profileId = foundUser.profile._id;
        Profile.findByIdAndRemove(profileId, (err) => {
          if (!err) {
            foundUser.remove();
            req.flash('success', 'User removed successfully');
            res.redirect('/admin/db/users');
          }
        })

      } else {
        foundUser.remove();
        req.flash('success', 'User removed successfully');
        res.redirect('/admin/db/users');

      }
    }
  });
});

//helper- class
router.get("/class/:className", function (req, res, next) {
  Class.findOne({
    className: req.params.className,
  }, function (err, classs) {
    if (err) {
      console.log(err);
    }
  })
      .populate({
        path: "subjects",
        model: "Subject"

      })
      .exec(function (err, classs) {
        if (err) {
          console.log(err);
          req.flash("error", "Couldn't find the details of chosen class");
          res.redirect("/admin/files/uploadFile");
        } else {
          res.json({
            classs: classs
          });
        }
      });
});

//helper- subject
router.get("/class/:className/subject/:subjectName", function (req, res, next) {
  Subject.findOne({
    subjectName: req.params.subjectName,
    className: req.params.className
  }, function (err, subject) {
    if (err) {
      console.log(err);
      next(new errors.generic);
    }
  })
      .populate({
        path: "chapters",
        model: "Chapter"

      })
      .exec(function (err, subject) {
        if (err) {
          console.log(err);
          req.flash("error", "Couldn't find the details of chosen subject");
          res.redirect("/admin/files/uploadFile");
        } else {
          res.json({
            subject: subject
          });
        }
      });
});

//helper-chapter
router.get("/chapter/:chapterName", function (req, res, next) {
  Chapter.findOne({
    chapterName: req.params.chapterName
  }, function (err, chapter) {
    if (err) {
      console.log(err);
      next(new errors.generic);
    }
  })
      .populate({
        path: "topics",
        model: "Topic"

      })
      .exec(function (err, chapter) {
        if (err) {
          console.log(err);
          req.flash("error", "Couldn't find the details of chosen chapter");
          res.redirect("/admin/files/uploadFile");
        } else {
          res.json({
            chapter: chapter
          });
        }
      });
});

//helper- topic
router.get("/topic/:topicName", function (req, res, next) {
  Topic.findOne({
    topicName: req.params.topicName
  }, function (err, topic) {
    if (err && !topic) {
      console.log(err);
      next(new errors.generic);
    } else {
      res.json({
        topic: topic
      });
    }
  });
});

//if not route mentioned in url
router.get("*", function (req, res) {
  res.redirect("/");
});

module.exports = router;

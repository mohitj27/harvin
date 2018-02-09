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
  centersRoutes = require("./center"),
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
router.use(vmsRoutes);
router.use('/admin/blog', blogRoutes);
router.use('/admin/centers', centersRoutes);


router.delete('/users/:userId', (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .populate({
      path: 'profile',
      modal: 'Profile'
    })
    .exec((err, foundUser) => {
      // console.log('foundUser', foundUser);
      if (!err && foundUser) {
        foundUser.remove()
        if(foundUser.profile){
          const profileId = foundUser.profile._id;
          // console.log('id', profileId);
          Profile.findByIdAndRemove(profileId, (err) => {
            if (!err) {
              req.flash(
                'success', "User account deleted successfully"
              )
              res.redirect('/admin/db/users')
            }
          })
        }else {
          req.flash(
            'success', "User account deleted successfully"
          )
          res.redirect('/admin/db/users')
        }
      } else if (!foundUser || err) {
        req.flash(
          'error', "Error while deleting User account"
        )
        res.redirect('/admin/db/users')
      }
    })

});

//helper- class
router.get("/class/:className", function(req, res, next) {
  if (req.user) {
    Class.findOne({
        className: req.params.className,
        atCenter: req.user._id
      })
      .populate({
        path: "subjects",
        model: "Subject"

      })
      .exec(function(err, classs) {
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
  } else {

    Class.findOne({
        className: req.params.className
      })
      .populate({
        path: "subjects",
        model: "Subject"

      })
      .exec(function(err, classs) {
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
  }

});

//helper- subject
router.get("/class/:className/subject/:subjectName", function(req, res, next) {
  if (req.user) {
    Subject.findOne({
        subjectName: req.params.subjectName,
        atCenter: req.user._id,
        className: req.params.className
      })
      .populate({
        path: "chapters",
        model: "Chapter"

      })
      .exec(function(err, subject) {
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
  } else {
    Subject.findOne({
        subjectName: req.params.subjectName,
        className: req.params.className
      })
      .populate({
        path: "chapters",
        model: "Chapter"

      })
      .exec(function(err, subject) {
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
  }
});

router.get('/classes', (req, res, next) => {
  if (req.user) {
    Class.find({
      atCenter: req.user._id
    }, (err, foundClasses) => {
      if (!err && foundClasses) {
        res.json({
          classes: foundClasses
        });
      }
    });
  } else {
    Class.find({}, (err, foundClasses) => {
      if (!err && foundClasses) {
        res.json({
          batches: foundClasses
        });
      }
    });
  }
})

//helper-chapter
router.get("/chapter/:chapterName", function(req, res, next) {
  if (req.user) {
    Chapter.findOne({
        chapterName: req.params.chapterName,
        atCenter: req.user._id
      })
      .populate({
        path: "topics",
        model: "Topic"

      })
      .exec(function(err, chapter) {
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
  } else {
    Chapter.findOne({
        chapterName: req.params.chapterName
      })
      .populate({
        path: "topics",
        model: "Topic"

      })
      .exec(function(err, chapter) {
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
  }
});

//helper- topic
router.get("/topic/:topicName", function(req, res, next) {
  if (req.user) {
    Topic.findOne({
      topicName: req.params.topicName,
      atCenter: req.user._id
    }, function(err, topic) {
      if (err && !topic) {
        console.log(err);
        next(new errors.generic);
      } else {
        res.json({
          topic: topic
        });
      }
    });
  } else {
    Topic.findOne({
      topicName: req.params.topicName
    }, function(err, topic) {
      if (err && !topic) {
        console.log(err);
        next(new errors.generic);
      } else {
        res.json({
          topic: topic
        });
      }
    });
  }
});

//if not route mentioned in url
router.get("*", function(req, res) {
  res.redirect("/");
});

module.exports = router;

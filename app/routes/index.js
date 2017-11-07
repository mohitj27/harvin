var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/User.js"),

    adminRoutes = require("./admin"),
    studentRoutes = require("./student"),
    batchRoutes = require("./batch"),
    fileRoutes = require("./file"),
    dbRoutes = require("./db"),
    examRoutes = require("./exam"),
    assignmentRoutes = require("./assignment"),
    qbRoutes = require("./questionBank"),
    resultsRoutes = require("./results"),

    Topic = require("../models/Topic.js"),
    Chapter = require("../models/Chapter.js"),
    Subject = require("../models/Subject.js"),
    Class = require("../models/Class.js");
File = require("../models/File.js");

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/batches", batchRoutes);
router.use("/files", fileRoutes);
router.use("/db", dbRoutes);
router.use("/exams", examRoutes);
router.use("/assignment", assignmentRoutes);
router.use("/questionBank", qbRoutes);
router.use("/results", resultsRoutes);

//Home
router.get("/", function (req, res) {
  res.render("home");
});

//user login -- for admin
router.get("/signup", function (req, res) {
  res.render("signup",{
    error: res.locals.msg_error[0]
  });
});

router.post("/signup", function (req, res) {
  var newUser = new User({username: req.body.username, isAdmin: true});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect('/signup');
    }
    passport.authenticate("local") (req, res, function(){
      req.flash("success", "Welcome to Harvin Academy :)");
      res.redirect("/");
    });
  });
});

//user login -- for admin
router.get("/login", function (req, res) {
  res.render("login",{
    error: res.locals.msg_error[0]
  });
});

//Handle user login -- for admin
router.post("/login", passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      successFlash: "Welcome back",
      failureFlash: true
    }),
    function (req, res) {

    }
);

//User logout-
router.get("/logout", function (req, res) {
  req.logout();
  req.flash({"success": "You Logged out successfully"});
  res.redirect("home");
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
          res.redirect("/files/uploadFile");
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
          res.redirect("/files/uploadFile");
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
          res.redirect("/files/uploadFile");
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


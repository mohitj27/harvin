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
  blogRoutes = require('./blog'),
  classRoutes = require('./class'),
  subjectRoutes = require('./subject'),
  chapterRoutes = require('./chapter'),
  topicRoutes = require('./topic'),
  Topic = require("../models/Topic.js"),
  Chapter = require("../models/Chapter.js"),
  Subject = require("../models/Subject.js"),
  Class = require("../models/Class.js"),
  Gallery = require("../models/Gallery.js"),
  File = require("../models/File.js");

router.use("/student", studentRoutes);
router.use("/admin/batches", batchRoutes);
router.use("/admin/files", fileRoutes);
router.use("/admin/db", dbRoutes);
router.use("/admin/exams", examRoutes);
router.use("/admin/assignment", assignmentRoutes);
router.use("/admin/questionBank", qbRoutes);
router.use("/admin/results", resultsRoutes);
router.use('/admin/blog', blogRoutes);
router.use('/admin/centers', centersRoutes);
router.use('/admin/classes', classRoutes);
router.use('/admin/subjects', subjectRoutes);
router.use('/admin/chapters', chapterRoutes);
router.use('/admin/topics', topicRoutes);
router.use("/admin", adminRoutes);
router.use(vmsRoutes);

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

//if not route mentioned in url
router.get("*", function(req, res) {
  res.redirect("/");
});

module.exports = router;

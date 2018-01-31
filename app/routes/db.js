var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"),
  errors = require("../error"),
  pluralize = require("pluralize"),
  moment = require("moment-timezone"),
  async = require("async"),
  fs = require("fs"),
  sharp = require("sharp"),
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
  path = require("path"),
  multer = require("multer"),
  fs = require("fs"),
  middleware = require("../middleware");

//TODO: This is where all the uploaded images are stored
var currTime = Date.now().toString() + "__";
var storage = multer.diskStorage({
  destination: __dirname + "/../../../HarvinDb/img",
  filename: function(req, file, callback) {
    callback(null, currTime + file.originalname);
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
          res.render("userProfileDb", {
            users: foundUsers
          });
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
          res.render("examDb", {
            exams: foundExams
          });
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
          res.render("fileDb", {
            files: foundFiles
          });
        } else {
          console.log(err);
          next(new errors.generic());
        }
      });
  }
);

router.get("/gallery/upload", (req, res, next) => {
  res.render("insertGallery");
});

router.get("/gallery/all/:category", (req, res, next) => {
  let categoryToDelete = req.params.category;
  Gallery.find({ category: categoryToDelete }).exec((err, items) => {
    if (!err) {
      items.forEach(item => {
        Gallery.findByIdAndRemove(item._id, (err)=>{});
      });
      req.flash(
        "success",
        "successfully deleted all items from current category"
      );
      return res.redirect("/admin/db/gallery");
    } else {
      console.log("err", err);
      return next(new errors.generic());
    }
  });
});

router.get("/gallery/:imageId/delete", (req, res, next) => {
  let imageIdToDelete = req.params.imageId;
  if (mongoose.Types.ObjectId.isValid(imageIdToDelete)) {
    Gallery.findByIdAndRemove(imageIdToDelete).exec((err, item) => {
      if (err) {
        console.log("err", err);
        return next(new errors.generic());
      }
      if (!item) {
        req.flash("error", "Item not found");
        return res.redirect("/admin/db/gallery");
      }
      req.flash("success", "Image deleted successfully");
      res.redirect("/admin/db/gallery");
    });
  } else {
    req.flash("error", "Invalid ObjectId provided");
    res.redirect("/admin/db/gallery");
  }
});



router.get("/gallery/all", (req, res, next) => {
  Gallery.find({}, (err, foundImages) => {
    if (!err && foundImages) {
      res.json({ images: foundImages });
    } else {
      next(new errors.generic());
    }
  });
});



router.get("/gallery", (req, res, next) => {
  res.render("galleryDb");
});

router.post("/gallery", (req, res, next) => {
  var upload = multer({
    storage: storage
  }).single("userFile");

  upload(req, res, function(err) {
    var fileName = req.file.originalname;

    //absolute file path
    var filePath = req.file.path;
    var srcList = filePath.split(path.sep);

    //relative file path (required by ejs file)

    var src = path.join(
      "/",
      srcList[srcList.length - 2],
      srcList[srcList.length - 1]
    );

    var uploadDate = moment(Date.now())
      .tz("Asia/Kolkata")
      .format("MMMM Do YYYY, h:mm:ss a");
    var description = req.body.description;
    var category = req.body.category;
    var parsedPath = path.parse(filePath);
    var thumbPath = path.join(
      "/",
      srcList[srcList.length - 2],
      "thumb",
      srcList[srcList.length - 1]
    );

    var newFile = {
      fileName,
      src,
      uploadDate,
      description,
      category,
      thumbPath,
      filePath
    };

    Gallery.create(newFile, (err, createdFile) => {
      if (!err && createdFile) {
        src = fs.createReadStream(createdFile.filePath);
        var thumbDir = path.join(parsedPath.dir, "thumb");
        if (!fs.existsSync(thumbDir)) {
          fs.mkdirSync(thumbDir);
          console.log("making thumb");
        } else {
          console.log("not making thumb");
        }

        var thumbPath = path.join(parsedPath.dir, "thumb", currTime + fileName);

        ws = fs.createWriteStream(thumbPath);
        var sharpStream = sharp().resize(300, 200);
        src.pipe(sharpStream).pipe(ws);

        req.flash("success", fileName + " uploaded successfully");
        res.redirect("/admin/db/gallery/upload");
      } else {
        console.log("err:", err);
        req.flash("error", "Couldn't upload the image");
        res.redirect("/admin/db/gallery/upload");
      }
    });
  });
});

module.exports = router;

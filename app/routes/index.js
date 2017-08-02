var express = require("express"),
	router = express.Router(),
	
    adminRoutes = require("./admin"),
    studentRoutes = require("./student"),
    batchRoutes = require("./batch"),
	fileRoutes = require("./file"),

	Topic = require("../models/Topic.js"),
    Chapter = require("../models/Chapter.js"),
    Subject = require("../models/Subject.js"),
    Class = require("../models/Class.js");

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/batches", batchRoutes);
router.use("/files", fileRoutes);

//Home-admin
router.get("/", function(req, res){
	var jsondata = {"hello": "world"};
    res.render("home");
});

//helper
router.get("/class/:className", function(req, res, next){
    Class.findOne({className:req.params.className}, function(err, classes){
		if(err) {
            console.log(err);
            // next(new errors.generic);
        }
	})
	.populate({
		path:"subjects",
		model:"Subject"
		
	})
	.exec(function(err, classs){
		if(err){
			 console.log(err);
             req.flash("error","Couldn't find the details of chosen class");
			 res.redirect("/files/uploadFile");
		}
		else{
            res.json({classs:classs});
		}
	});
});

//helper
router.get("/subject/:subjectName", function(req, res, next){
    Subject.findOne({subjectName:req.params.subjectName}, function(err, subjects){
		if(err) {
            console.log(err);
            next(new errors.generic);
        }
	})
	.populate({
		path:"chapters",
		model:"Chapter"
		
	})
	.exec(function(err, subject){
		if(err){
             console.log(err);
             req.flash("error","Couldn't find the details of chosen subject");
			 res.redirect("/files/uploadFile");
		}
		else{
            res.json({subject:subject});
		}
	});
});

//helper
router.get("/chapter/:chapterName", function(req, res, next){
    Chapter.findOne({chapterName:req.params.chapterName}, function(err, chapters){
		if(err) {
            console.log(err);
            next(new errors.generic);
        }
	})
	.populate({
		path:"topics",
		model:"Topic"
		
	})
	.exec(function(err, chapter){
		if(err){
             console.log(err);
             req.flash("error","Couldn't find the details of chosen chapter");
			 res.redirect("/files/uploadFile");
		}
		else{
            res.json({chapter:chapter});
		}
	});
});


//if not route mentioned in url
router.get("*", function(req, res){
    res.redirect("/");
});

module.exports = router;
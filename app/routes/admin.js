var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/User.js"),
    File = require("../models/File.js"),
    Topic = require("../models/Topic.js"),
    Chapter = require("../models/Chapter.js"),
    Subject = require("../models/Subject.js"),
    Class = require("../models/Class.js"),
    path = require('path'),
    multer = require('multer'),
    moment = require("moment-timezone"),
    fs = require("file-system"),
    async = require("async"),
    middleware = require("../middleware");
    errors = require("../error");
    
//setting disk storage for uploaded files
var storage = multer.diskStorage({
	destination: __dirname+ "/../../../uploads/",
	filename: function(req, file, callback) {
		callback(null,Date.now()+"__" +file.originalname);
	}
});

function fileUploadError(req, res, next){
    //deleting uploaded file from upload directory
    fs.unlink(req.file.path, function(err){
        if(err) {
            console.log(err);
            next(new errors.generic)
        }
        else console.log("file deleted from uploads directory")
    });

}

function fileUploadSuccess(req, res){
    req.flash("success", req.file.originalname +" uploaded successfully");
    res.redirect("/admin/uploadFile");
}

router.get("/class/:className", function(req, res, next){
    Class.findOne({className:req.params.className}, function(err, classes){
		if(err) {
            console.log(err);
            next(new errors.generic);
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
			 res.redirect("/admin/uploadFile");
		}
		else{
            res.json({classs:classs});
		}
	});
});

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
			 res.redirect("/admin/uploadFile");
		}
		else{
            res.json({subject:subject});
		}
	});
});

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
			 res.redirect("/admin/uploadFile");
		}
		else{
            res.json({chapter:chapter});
		}
	});
});


//User registration form-- for admin
router.get("/signup", function(req, res){
    res.render("signup");
});

//Handle user registration-- for admin
router.post("/signup", function(req, res, next){
    User.register(new User(
            { 
                username : req.body.username,
                isAdmin:true 
            }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/admin/signup");
            
        }

        passport.authenticate("local")(req, res, function () {
            req.flash("success","Successfully signed you in as "+ req.body.username);
            res.redirect("/");
        });
    });
});

//User login form-- admin
router.get("/login", function(req, res){
    res.render("login");
});

//Handle user login -- for admin
router.post("/login", passport.authenticate("local", 
    { 
        successRedirect: "/",
        failureRedirect: "/admin/login",
        successFlash:"Welcome back",
        failureFlash:true
    }),
    function(req, res) {
		
    }
);

//User logout-- admin
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//Form for uploading a file
router.get('/uploadFile', function(req, res, next) {
    // res.json(subjects);
	Class.find({}, function(err, classes){
        if(err) console.log(err);
        // console.log(classes)
	})
	.populate({
        path:"subjects",
        model:"Subject",
        populate:{
            path:"chapters",
            model:"Chapter",
            populate:{
                path:"topics",
                model:"Topic",
                populate:{
                        path:"files",
                        model:"File"
                }
		    }
        }
	})
	.exec(function(err, classes){
		if(err){
			 console.log(err);
             req.flash("error","Please try again");
			 res.redirect("/admin/uploadFile");
		}
		else{
            res.render('uploadFile',{classes:classes});
            // res.json(classes)
		}
	});
});

//Handle file upload
router.post('/uploadFile', function(req, res) {
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
        var fileName = req.file.originalname;
        var fileType = path.extname(req.file.originalname);
        var filePath = req.file.path;
        var uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
        var fileSize = req.file.size;
        var className = req.body.className;
        var subjectName = req.body.subjectName;
        var chapterName = req.body.chapterName;
        var topicName = req.body.topicName;
        console.log(className)

        var newFile = {
            fileName,
            fileType,
            filePath,
            uploadDate,
            fileSize,
            className,
            subjectName,
            chapterName,
            topicName,

        }

        async.waterfall(
            [
                function (callback) {
                    File.create(newFile, function(err, createdFile){
                        if(!err && createdFile){
                            callback(null, createdFile);
                        }else{
                            console.log(err);
                            callback(err);
                        }
                    });
                },
                function (createdFile, callback) {
                    Topic.findOneAndUpdate(
                        { topicName: topicName },
                        { $addToSet:{ files:createdFile } , $set:{topicName:topicName}},
                        { upsert: true, new: true, setDefaultsOnInsert: true },
                        function (err, createdTopic) {
                            if(!err && createdTopic){
                                callback(null, createdTopic)
                            }else{
                                console.log(err);
                                callback(err);
                            }
                        }
                    );
                },
                function (createdTopic, callback) {
                    Chapter.findOneAndUpdate(
                       { chapterName: chapterName },
                       { $addToSet:{ topics:createdTopic } , $set:{chapterName:chapterName}},
                       { upsert: true, new: true, setDefaultsOnInsert: true },
                       function (err, createdChapter) {
                           if(!err && createdChapter){
                               callback(null, createdChapter)
                           }else{
                               console.log(err);
                               callback(err);
                           }
                       }
                   );
                },
                function (createdChapter, callback) {
                     Subject.findOneAndUpdate(
                       { subjectName: subjectName },
                       { $addToSet:{ chapters:createdChapter } , $set:{ subjectName:subjectName}},
                       { upsert: true, new: true, setDefaultsOnInsert: true },
                       function (err, createdSubject) {
                           if(!err && createdSubject){
                               callback(null, createdSubject)
                               
                           }else{
                               console.log(err);
                               callback(err);
                           }
                        }
                    );
                },
                function (createdSubject, callback) {
                    Class.findOneAndUpdate(
                        { className: className },
                        { $addToSet:{ subjects:createdSubject } , $set:{className:className}},
                        { upsert: true, new: true, setDefaultsOnInsert: true },
                        function (err, createdClass) {
                            if(!err && createdClass){
                                callback(null)
                                fileUploadSuccess(req,res);
                            }else{
                               console.log(err);
                               callback(err);
                           }
                        }
                    );
                }
        
            ],
            function(err, result){
                if(err){
                    console.log(err);
                    fileUploadError(req,res);
                }
            }
        );

	})
});

module.exports = router;
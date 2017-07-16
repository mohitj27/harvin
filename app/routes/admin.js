var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User.js");
var File = require("../models/File.js");
var path = require('path');
var multer = require('multer') ;
var moment = require("moment-timezone");
var fs = require("file-system");
var async = require("async");

//setting disk storage for uploaded files
var storage = multer.diskStorage({
	destination: "uploads/",
	filename: function(req, file, callback) {
		callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
	}
});

//Handle file upload
router.post('/uploadFile', function(req, res) {
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
        /*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        File is not uploading onto heroku. upload it to amazon s3 or something else.
        %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%*/
        var fileName = req.file.originalname;
        var fileType = path.extname(req.file.originalname);
        var filePath = req.file.path;
        var uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
        var fileSize = req.file.size;
        var subjectName = req.body.subjectName;
        var chapterName = req.body.chapterName;
        var topicName = req.body.topicName;

        var newFile = {
            fileName,
            fileType,
            filePath,
            uploadDate,
            fileSize,
            subjectName,
            chapterName,
            topicName
        }

        File.create(newFile, function(err, createdFile){
            if(err){
                console.log("error while storing file in db-->/n");
                console.log(err);

                //deleting uploaded file from upload directory
                fs.unlink(req.file.path, function(err){
                    if(err) {
                        console.log("error while deleting uploaded file-->/n");
                        console.log(err);
                    }
                    else console.log("file deleted from uploads directory")
                });

                req.flash("error", err._message);
                res.redirect("/admin/uploadFile");

            }
            else{
                console.log(createdFile);
                req.flash("success", req.file.originalname +" uploaded successfully");
                res.redirect("/admin/uploadFile");
//
                // async.waterfall(
                //     [
                //         function(callback){
                            
                //         }
                //     ],
                //     function(err, result){
                //         if(err) {
                //             console.log(err);
                //             req.flash("error", "Please try again");
                //             res.redirect("/admin/uploadFile");
                //         }
                //     }
                // );
            }
        });

        

	})
});

//User registration form-- for admin
router.get("/signup", function(req, res){
    res.render("signup");
});

//Handle user registration-- for admin
router.post("/signup", function(req, res){
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        passport.authenticate("local")(req, res, function () {
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
router.get('/uploadFile', function(req, res) {
	res.render('upload');
});



module.exports = router;
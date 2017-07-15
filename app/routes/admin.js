var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User.js");
var File = require("../models/File.js");
var path = require('path');
var multer = require('multer') ;
var moment = require("moment-timezone");
var fs = require("file-system");

//setting disk storage for uploaded files
var storage = multer.diskStorage({
	destination: "./uploads",
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
        var currentTime = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');
        var newFile = {
            fileName:req.file.originalname,
            fileType:path.extname(req.file.originalname),
            filePath:req.file.path,
            uploadDate:currentTime,
            fileSize:req.file.size,
            subjectName:req.body.subjectName,
            chapterName:req.body.chapterName,
            topicName:req.body.topicName
        }

        File.create(newFile, function(err, createdFile){
            if(err){
                console.log(err);

                //deleting uploaded file from upload directory
                fs.unlink(req.file.path, function(err){
                    if(err) console.log("file deletion err\n" + err);
                    else console.log("file deleted from uploads directory")
                });

                req.flash("error", err);
                res.redirect("/admin/uploadFile");

            }
            else{
                req.flash("success", req.file.originalname +" uploaded successfully");
                res.redirect("/admin/uploadFile");
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
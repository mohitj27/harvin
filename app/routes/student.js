var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User.js");
var Subject = require("../models/Subject.js");
var File = require("../models/File.js");
errors = require("../error");

//User login form-- admin
router.get("/login", function(req, res){
    res.json({erro:res.locals.msg_error[0]});
});

//Handle user login -- for student
router.post("/login", passport.authenticate("local", 
    { 
        failureRedirect: "/student/login",
        successFlash:"Welcome back",
        failureFlash:true
    }),
    function(req, res) {
		res.status(200).json(req.user);
    }
);

//User logout-- student
router.get("/logout", function(req, res) {
    req.logout();
    res.json({"success":"You Logged out successfully"});
});

//Handle user registration-- for student
router.post("/signup", function(req, res){
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        passport.authenticate("local")(req, res, function () {
			res.status(200).json(user);
        });
    });
});

router.get("/files/:fileId", function(req, res, next){
	File.findById(req.params.fileId, function(err, foundFile){
		if(err){
			console.log(err)
			next(new errors.notFound);
		}
		else{
			res.download(foundFile.filePath, foundFile.fileName, function(err){
				if(err){
					console.log(err);
				}
			});
		}
	});
});

//sending subject list
router.get("/subjects", function(req, res, next){

	// res.json(subjects);
	Subject.find({}, function(err, subjects){
		if(err){
			console.log(err)
			next(new errors.notFound);
		}
	})
	.populate({
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
	})
	.exec(function(err, subjects){
		if(err){
			console.log(err)
			next(new errors.generic);
		}
		else{
			res.type('application/json');
   			res.json({"subjects": subjects});
		}
	});

});

module.exports = router;
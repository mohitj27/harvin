var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User.js");
var Subject = require("../models/Subject.js");

var subjects={
	"subjects":[
		{
			subjectName:"subject1",
		},
		{
			subjectName:"subject2",
		},
		{
			subjectName:"subject3",
		},
		{
			subjectName:"subject4",
		},
		{
			subjectName:"subject5",
		},
		{
			subjectName:"subject6",
		},
		{
			subjectName:"subject7",
		}
	]
}

//clear all student database
router.get("/clearall", function(req, res){
	User.remove({}, function(err){
		if(err){
                        console.log(err);
                        res.json(err);
                    }else{
                        console.log("Removed all camps");
                        res.json({"success":"Removed all users"});
                    }
	});
});

//User login form-- admin
router.get("/login", function(req, res){
    res.json({error:res.locals.msg_error});
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

//sending subject list
router.get("/subjects", function(req, res){

	// res.json(subjects);
	Subject.find({}, function(err, subjects){
		if(err) console.log(err);
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
			 console.log(err);
			 res.json("error", "Please try again");
		}
		else{
			res.json({"subjects": subjects});
		}
	});

});

module.exports = router;
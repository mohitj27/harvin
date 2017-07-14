var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User.js");

var subjects=[
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
];

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
		res.json(req.user);
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
            res.json(user);
        });
    });
});

//sending subject list
router.get("/subjects", function(req, res){
	res.json(subjects);
});

module.exports = router;
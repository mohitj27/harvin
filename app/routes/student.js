var express = require("express");
var router = express.Router();
var passport = require("passport");



//Handle user login -- for student
router.post("/student/login", passport.authenticate("local", 
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
router.get("/student/logout", function(req, res) {
    req.logout();
    res.json({"success":"You Logged out successfully"});
});

//sending subject list
router.get("/student/subjects", function(req, res){
	res.json(subjects);
});

module.exports = router;
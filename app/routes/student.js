var express = require("express"),
	passport = require("passport"),

	User = require("../models/User.js"),
    Class = require("../models/Class.js"),
	errors = require("../error"),

	router = express.Router();

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

//sending subject list
router.get("/classes", function(req, res, next){

	Class.find({}, function(err, classes){
		if(err){
			console.log(err)
			next(new errors.notFound);
		}
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
			console.log(err)
		}
		else{
			res.type('application/json');
   			res.json({"classes": classes});
		}
	});

});

module.exports = router;
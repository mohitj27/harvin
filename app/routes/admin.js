var express = require("express");
var router = express.Router();
var passport = require("passport");


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


//Handle file upload
router.post('/admin/uploadFile', function(req, res) {
	var upload = multer({
		storage: storage
	}).single('userFile')
	upload(req, res, function(err) {
        //TODO: save the file URI in mongodb
		res.end('File is uploaded')
	})
});

//User registration form-- for admin
router.get("/admin/signup", function(req, res){
    res.render("signup");
});

//Handle user registration-- for admin
router.post("/admin/signup", function(req, res){
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

//Handle user registration-- for student
router.post("/student/signup", function(req, res){
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

//User login form-- admin
router.get("/admin/login", function(req, res){
    res.render("login",{error:res.locals.msg_error});
});

//Handle user login -- for admin
router.post("/admin/login", passport.authenticate("local", 
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
router.get("/admin/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//Form for uploading a file
router.get('/admin/uploadFile', function(req, res) {
	res.render('upload');
});

//if not route mentioned in url
router.get("*", function(req, res){
    res.send("No page found :(((((((");
})

module.exports = router;
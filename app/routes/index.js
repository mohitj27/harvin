var express = require("express");
var router = express.Router();
var passport = require("passport");


//Home-admin
router.get("/", function(req, res){
	var jsondata = {"hello": "world"};
    res.render("home");
});



module.exports = router;
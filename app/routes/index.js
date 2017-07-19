var express = require("express"),
    router = express.Router(),
    passport = require("passport"),

    adminRoutes = require("./admin"),
    studentRoutes = require("./student");

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);

//Home-admin
router.get("/", function(req, res){
	var jsondata = {"hello": "world"};
    res.render("home");
});

//if not route mentioned in url
router.get("*", function(req, res){
    res.send("No page found :(((((((");
});

module.exports = router;
var express = require("express"),
    router = express.Router(),
    passport = require("passport"),

    adminRoutes = require("./admin"),
    studentRoutes = require("./student");
    batchRoutes = require("./batch");
    

router.use("/admin", adminRoutes);
router.use("/student", studentRoutes);
router.use("/batch", batchRoutes);

//Home-admin
router.get("/", function(req, res){
	var jsondata = {"hello": "world"};
    res.render("home");
});

//if not route mentioned in url
router.get("*", function(req, res){
    res.redirect("/");
});

module.exports = router;
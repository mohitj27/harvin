var express = require("express"),
  passport = require("passport"),

  User = require("../models/User.js"),
  middleware = require("../middleware"),

  router = express.Router();

//User registration form-- for admin
router.get("/signup", function(req, res) {
  res.render("signup");
});

//ADMIN HOME
router.get("/", function(req, res) {
  res.render("home");
});
//Handle user registration-- for admin
router.post("/signup", function(req, res, next) {
  User.register(new User({
    username: req.body.username,
    role: req.body.role
  }), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/admin/signup");

    }

    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Successfully signed you in as " + req.body.username);
      res.redirect("/admin");
    });
  });
});


//User login form-- admin
router.get("/login", function(req, res) {
  res.render("login", {error: res.locals.msg_error[0]});
});

//Handle user login -- for admin
router.post("/login", passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    successFlash: "Welcome back",
    failureFlash: true
  }),
  function(req, res) {

  }
);

//User logout-- admin
router.get("/logout", function(req, res) {
  req.logout();
  req.flash({"success": "You Logged out successfully"});
  res.redirect("/admin");
});

module.exports = router;

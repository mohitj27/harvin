const _ = require('lodash');
var middleware = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "login please");
    res.redirect("/login");
    // next();
  },

  isAdmin: function (req, res, next) {
		if(_.indexOf(req.user.role, 'admin') !== -1){
		  return next();
    }
    req.flash("error", "You are not authorized. Please login into admin account");
    res.redirect("/login");
  },

  isCentre: function (req, res, next) {
    if(_.indexOf(req.user.role, 'centre') !== -1){
      return next();
    }
    req.flash("error", "You are not authorized. Please login into Centre account");
    res.redirect("/login");
  },

  isCentreOrAdmin: function (req, res, next) {
    if(_.indexOf(req.user.role, 'centre') !== -1 ||
        _.indexOf(req.user.role, 'admin') !== -1){
      return next();
    }
    req.flash("error", "You are not authorized. Please login into Centre or Admin account");
    res.redirect("/login");
  },

  isStudent: function (req, res, next) {
    if(_.indexOf(req.user.role, 'student') !== -1){
      return next();
    }
    req.flash("error", "You are not authorized. Please login into Student account");
    res.redirect("/login");
  }

};
module.exports = middleware;

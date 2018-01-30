const _ = require('lodash');
var middleware = {
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "login please");
    console.log('req', req);
    req.session.returnTo = req.originalUrl;
    res.redirect("/admin/login");
    // next();
  },

  isAdmin: function(req, res, next) {
    if (_.indexOf(req.user.role, 'admin') !== -1) {
      return next();
    }
    req.flash("error", "You are not authorized. Please login into admin account");

    req.session.returnTo = req.originalUrl;
    res.redirect("/admin/login");
  },

  isCentre: function(req, res, next) {
    if (_.indexOf(req.user.role, 'centre') !== -1) {
      return next();
    }
    req.flash("error", "You are not authorized. Please login into Centre account");

    req.session.returnTo = req.originalUrl;
    res.redirect("/admin/login");
  },

  isCentreOrAdmin: function(req, res, next) {
    if (_.indexOf(req.user.role, 'centre') !== -1 ||
      _.indexOf(req.user.role, 'admin') !== -1) {
      return next();
    }
    req.flash("error", "You are not authorized. Please login into Centre or Admin account");

    req.session.returnTo = req.originalUrl;
    res.redirect("/admin/login");
  },

  isStudent: function(req, res, next) {
    if (_.indexOf(req.user.role, 'student') !== -1) {
      return next();
    }
    req.flash("error", "You are not authorized. Please login into Student account");
    res.redirect("/admin/login");
  }

};
module.exports = middleware;

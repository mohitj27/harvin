const _ = require('lodash')

const errorHandler = require('../errorHandler')
var middleware = {
  
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      delete req.session.returnTo
      return next()
    }
    req.session.returnTo = req.originalUrl
    res.locals.flashUrl = '/admin/login'

    return errorHandler.errorResponse('NOT_LOGGED_IN', null, next)
  },

  isAdmin: function (req, res, next) {
    if (_.indexOf(req.user.role, 'admin') !== -1) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    res.locals.flashUrl = '/admin/login'

    return errorHandler.errorResponse('NOT_AN_ADMIN', null, next)
  },

  isCentre: function (req, res, next) {
    if (_.indexOf(req.user.role, 'centre') !== -1) {
      return next()
    }

    req.session.returnTo = req.originalUrl
    res.locals.flashUrl = '/admin/login'

    return errorHandler.errorResponse('NOT_A_CENTER', null, next)
  },

  isCentreOrAdmin: function (req, res, next) {
    if (_.indexOf(req.user.role, 'centre') !== -1 ||
      _.indexOf(req.user.role, 'admin') !== -1) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    res.locals.flashUrl = '/admin/login'

    return errorHandler.errorResponse('NOT_A_CENTER_OR_ADMIN', null, next)
  }

  // isStudent: function(req, res, next) {
  //   if (_.indexOf(req.user.role, 'student') !== -1) {
  //     return next();
  //   }
  //   req.flash("error", "You are not authorized. Please login into Student account");
  //   res.redirect("/admin/login");
  // }

}
module.exports = middleware

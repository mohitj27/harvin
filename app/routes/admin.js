const express = require('express')
const passport = require('passport')
const userController = require('../controllers/user.controller')
const errorHandler = require('../errorHandler')

let router = express.Router()

// User registration form-- for admin
router.get('/signup', function (req, res) {
  res.render('signup')
})

// ADMIN HOME
router.get('/', function (req, res) {
  res.render('home')
})

// Handle user registration-- for admin
router.post('/signup', async function (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  const role = req.body.role

  res.locals.flashUrl = '/admin/signup'

  if (!role || role.length <= 0) return errorHandler.errorResponse('INVALID_FIELD', 'role', next)

  try {
    await userController.registerUser({
      username,
      password,
      role
    })

    passport.authenticate('local')(req, res, function () {
      req.flash('success', 'Successfully signed you in as ' + req.body.username)
      res.redirect(req.session.returnTo || '/admin')
      delete req.session.returnTo
    })
  } catch (e) {
    next(e)
  }
})

// User login form-- admin
router.get('/login', function (req, res) {
  res.render('login', {
    error: res.locals.msg_error[0]
  })
})

// Handle user login -- for admin
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/admin/login',
  successFlash: 'Welcome back',
  failureFlash: true
}),
function (req, res) {
  res.redirect(req.session.returnTo || '/admin')
  delete req.session.returnTo
})

// User logout-- admin
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/admin')
})

module.exports = router

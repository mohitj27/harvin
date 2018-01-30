var express = require("express"),
  errors = require("../error"),
  middleware = require("../middleware"),
  Center = require('./../models/Center'),
  router = express.Router();

router.get('/all', (req, res, next) => {
  res.render('allCenters')
});


module.exports = router

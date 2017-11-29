var express = require("express"),
    async = require("async"),
    moment = require("moment-timezone"),
    errors = require("../error"),
    middleware = require("../middleware"),
    Query = require('./../models/Query');

router = express.Router();

router.get('/', (req, res, next) => {
  console.log('form route');
  res.render("form1");
});
module.exports = router;


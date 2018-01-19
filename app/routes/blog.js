var express = require("express"),
    moment = require("moment-timezone"),
    errors = require("../error"),
    middleware = require("../middleware"),
    fs=require('fs');

router = express.Router();

router.get('/', (req, res, next) => {
  res.render("newBlog");
});

router.post("/", (req, res, next) => {
  console.log('content', req.body);

  res.send(200)
})
module.exports = router;

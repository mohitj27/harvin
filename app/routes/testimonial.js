var express = require("express"),
    errors = require("../error"),
    middleware = require("../middleware"),
router = express.Router();

router.get('/', (req, res, next) => {
  res.render('testimonial');
});

module.exports = router;


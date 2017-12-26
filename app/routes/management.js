var express = require("express"),
    errors = require("../error"),
    middleware = require("../middleware"),
    Gallery = require('./../models/Gallery');

router = express.Router();

//TODO: This is where output is shown. (All the uploaded images)
router.get('/', (req, res, next) => {
  Gallery.find({}, (err, foundImages) => {
    if(!err && foundImages){
      res.render('management', {items: foundImages});
    }
  });
});

module.exports = router;


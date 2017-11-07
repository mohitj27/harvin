var express = require("express"),
    Result = require("../models/Result.js"),
    errors = require("../error"),
    middleware = require("../middleware"),

    router = express.Router();

router.get("/", (req, res, next) => {
  Result.find({})
      .populate(
          {
            path: 'user',
            model: "User",
            populate:{
              path: 'profile',
              model: 'Profile',
              populate: {
                path: 'batch',
                model: 'Batch'
              }
            }
          }
      )
      .populate(
          {
            path: 'exam',
            model: "Exam",
          }
      )
      .exec((err, foundResults) => {
        if( !err && foundResults) {

          res.render('resultDb', {results: foundResults});
        }else{
          console.log('err', err);
          next(new errors.generic());
        }
      });
});

module.exports = router;


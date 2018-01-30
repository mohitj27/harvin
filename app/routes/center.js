var express = require("express"),
  errors = require("../error"),
  middleware = require("../middleware"),
  Center = require('./../models/Center'),
  router = express.Router();

router.get('/all', (req, res, next) => {
  res.render('allCenters')
});

router.get('/:centerName', (req, res, next) => {
  let centerName = req.params.centerName;
  Center.findOne({centerName})
  .exec((err, foundCenter) => {
    if(err){
      console.log('err', err);
      next(new errors.generic())
    } else if(!foundCenter){
      res.render('notFound')
    }else {
      res.render('centerView', {foundCenter});
    }
  })
})

module.exports = router

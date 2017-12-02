var express = require("express"),
    async = require("async"),
    moment = require("moment-timezone"),
    errors = require("../error"),
    middleware = require("../middleware"),
    Visitor = require('./../models/Visitor');
router = express.Router();

router.get('/new', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  res.render('newVisitor');
});

router.get('/all', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  Visitor.find({}, (err, foundVisitors) => {
    if (!err && foundVisitors) {
      res.render('visitorDb', {visitors: foundVisitors});
    } else {
      console.log(err);
      next(new errors.generic());
    }
  });
});

router.get('/', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  res.render('vmsLanding');
})

router.post('/', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const emailId = req.body.emailId;
  const classs = req.body.classs;
  const date = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');

  const newVisitor = new Visitor({
    name,
    phone,
    emailId,
    classs,
    date
  });

  newVisitor.save((err, createdVisitor) => {
    if (!err && createdVisitor) {

      req.flash("success", 'Your response has been saved successfully');
      res.redirect('/vms');
    } else {
      console.log(err);
      next(new errors.generic());
    }
  });

});

router.delete('/:visitorId', (req, res, next) => {
  Visitor.findByIdAndRemove(req.params.visitorId, (err) => {
    if (!err) {
      req.flash('success', 'Entry deleted successfully');
      res.redirect('/visitors');
    } else {
      console.log(err);
      next(new errors.generic());
    }
  });
});

module.exports = router;


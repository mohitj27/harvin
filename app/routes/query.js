var express = require("express"),
    async = require("async"),
    moment = require("moment-timezone"),
    errors = require("../error"),
    middleware = require("../middleware"),
    Query = require('./../models/Query');

router = express.Router();

router.get('/new', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  res.render('newQuery');
});

router.get('/', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  Query.find({}, (err, foundQueries) => {
    if (!err && foundQueries) {
      // res.json({queries: foundQueries});
      res.render('queryDb', {queries: foundQueries});
    } else {
      console.log(err);
      next(new errors.generic());
    }
  })
});

router.post('/', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const emailId = req.body.emailId;
  const queryMsg = req.body.queryMsg;
  const classs = req.body.classs;
  const date = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a');

  const newQuery = new Query({
    name,
    phone,
    emailId,
    queryMsg,
    classs,
    date
  });

  newQuery.save((err, createdQuery) => {
    if (!err && createdQuery) {

      req.flash("success", 'Query has been saved successfully');
      res.redirect('/queries/new');
    } else {
      console.log(err);
      next(new errors.generic());
    }
  });

});

router.delete('/:queryId', (req, res, next) => {
  Query.findByIdAndRemove(req.params.queryId, (err) => {
    if (!err) {
      req.flash('success', 'Query deleted successfully');
      res.redirect('/queries');
    } else {
      console.log(err);
      next(new errors.generic());
    }
  })
});

module.exports = router;


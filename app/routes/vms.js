var express = require("express"),
    async = require("async"),
    moment = require("moment-timezone"),
    errors = require("../error"),
    middleware = require("../middleware"),
    Visitor = require('./../models/Visitor');
    Gallery = require('./../models/Gallery');
router = express.Router();//helper- class
//helper- class
router.get("/gallery/:category", function (req, res, next) {
  console.log('heloooooooooooooooooooooooooooop')
  Class.findOne({
    className: req.params.className,
  }, function (err, classs) {
    if (err) {
      console.log(err);
    }
  })
      .populate({
        path: "subjects",
        model: "Subject"

      })
      .exec(function (err, classs) {
        if (err) {
          console.log(err);
          req.flash("error", "Couldn't find the details of chosen class");
          res.redirect("/files/uploadFile");
        } else {
          res.json({
            classs: classs
          });
        }
      });
});

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
});

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
      res.redirect('/vms/all');
    } else {
      console.log(err);
      next(new errors.generic());
    }
  });
});

router.get('/aboutus',(req,res,next)=>{
  res.render('aboutus')
})

router.get('/locations',(req,res,next)=>{
  res.render('aboutus')
})

router.get('/courses',(req,res,next)=>{
  res.render('aboutus')
})

//TODO: ishank - uncomment the commented lines and remove line 83
//TODO: ishank - Check all TODO and refer management.ejs && db.js
router.get('/gallery',(req,res,next)=>{
//  res.render('gallery');

  Gallery.find({}, (err, foundImages) => {
    if(!err && foundImages){
      res.render('gallery', {items: foundImages});
      console.log({items:foundImages})
    }
  });
});

router.get('/results',(req,res,next)=>{
  res.render('aboutus')
})

router.get('/faculty',(req,res,next)=>{
  res.render('aboutus')
})
//helper- class


module.exports = router;

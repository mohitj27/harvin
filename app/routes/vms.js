const express = require("express"),
  async = require("async"),
  fs = require('fs'),
  moment = require("moment-timezone"),
  errors = require("../error"),
  errorHandler = require('../errorHandler'),
  middleware = require("../middleware"),
  sharp = require('sharp'),
  request = require('request'),
  Gallery = require('./../models/Gallery'),
  Visitor = require('./../models/Visitor'),
  Blog = require('./../models/Blog'),
  User = require('./../models/User'),
  vmsController = require('./../controllers/vms.controller'),
  validator = require('validator'),
router = express.Router(),
Promise = require('bluebird');
mongoose.Promise = Promise;

router.get('/test', (req, res, next) => {
  res.render('testGallery')
});

router.get('/', (req, res, next) => {
  Gallery.find({
    category: {$in:['results']}
  })
  .exec((err, foundStudents) => {
    if (!err && foundStudents) {
      res.render('vmsLanding', {
        students: foundStudents
      });
    } else {
      console.log(err);
      next(new errors.generic());
    }
  })
})

router.get('/vms', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res) => {
  res.render('newVisitor')
})
router.post('/vms', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  const name = req.body.name
  const phone = req.body.phone || ''
  const emailId = req.body.emailId || ''
  const classs = req.body.classs
  const date = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a')
  const comments = req.body.comments
  const address = req.body.address
  const referral = req.body.referral
  const school = req.body.school
  const aim = req.body.aim

  res.locals.flashUrl = '/vms'

  if (!name) return errorHandler.errorResponse('INVALID_FIELD', "visitor name", next);
  if (!classs) return errorHandler.errorResponse('INVALID_FIELD', 'class', next);
  if (!address) return errorHandler.errorResponse('INVALID_FIELD', 'address', next);
  if (!referral) return errorHandler.errorResponse('INVALID_FIELD', 'referral', next);
  if (!school) return errorHandler.errorResponse('INVALID_FIELD', 'school', next);
  if (!aim) return errorHandler.errorResponse('INVALID_FIELD', 'aim', next);

  if (!phone || validator.isEmpty(phone) || !validator.isLength(phone, {
      min: 10,
      max: 10
    })) {
    return errorHandler.errorResponse('INVALID_FIELD', 'phone', next);
  }

  if (!emailId || !validator.isEmail(emailId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'email', next);
  }
  const newVisitor = {
    name,
    phone,
    emailId,
    classs,
    date,
    comments,
    address,
    referral,
    school,
    aim
  }

  var promise = vmsController.addNewVisitor(newVisitor)
  promise.then(function(createdVisitor) {
    req.flash("success", 'Your response has been saved successfully')
    res.redirect('/vms')
  }, function(err) {
    next(err || 'SERVER_ERROR')
  })
});

router.delete('/:visitorId', (req, res, next) => {
  Visitor.findByIdAndRemove(req.params.visitorId, (err) => {
    if (!err) {
      req.flash('success', 'Entry deleted successfully')
      res.redirect('/admin/db/visitors')
    } else {
      console.log(err)
      next(new errors.generic())
    }
  });
});

router.get('/aboutus', (req, res, next) => {
  res.render('aboutus')
})

router.get('/centers', (req, res, next) => {
  res.render('centers')
})

router.post('/centers', (req, res, next) => {

  req.flash('success', 'Response recoreded successfully, We will get back to you soon!');
  res.redirect('/centers')

})

router.get('/courses', (req, res, next) => {
  res.render('courses')
})

//helper- class

router.get('/gallery/category', function(req, res, next) {
  let category = req.query.category;
  let limit = req.query.limit
  Gallery.find({category: {$in:category}})
  .sort({uploadDate: -1})
  .limit(parseInt(limit))
  .exec(function(err, gallery) {
    if (err) {
      console.log(err)
    } else {
      res.json({
        gallery: gallery
      });
    }
  });
});


//TODO: ishank - uncomment the commented lines and remove line 83
//TODO: ishank - Check all TODO and refer management.ejs && db.js
router.get('/gallery', (req, res, next) => {
  Gallery.find({}, (err, foundImages) => {
    if (!err && foundImages) {
      res.render('gallery', {
        items: foundImages
      });
    }
  });
});

router.get('/results', (req, res, next) => {
  Gallery.find({
    category: 'results'
  }, (err, foundStudents) => {
    if (!err && foundStudents)
      res.render('results', {
        students: foundStudents,
        testimonials: foundStudents
      })
    else {
      console.log(err)
      next(new errors.generic())
    }
  })
})

router.get('/team', (req, res, next) => {
  res.render('team')
})

router.get('/tnc', (req, res, next) => {
  res.render('tnc')
});

router.get('/privacy', (req, res, next) => {
  res.render('privacy')
})

router.get('/careers', (req, res, next) => {
  res.render('careers')
})

router.post('/careers', (req, res, next) => {
  req.flash('success', 'Response recoreded successfully, We will get back to you soon!')
  res.redirect('/careers')
})

router.get('/blog', (req, res, next) => {
  console.log('title', req.query.title)
  if (req.query.title) {
    Blog.findOne({
        "blogTitle": req.query.title
      })
      .populate({
        path: 'author',
        modal: "User"
      })
      .exec((err, foundBlog) => {
        console.log('foundBlog', foundBlog);
        if (err) {
          return console.log('err', err);
        } else {
          fs.readFile(__dirname + '/../../../HarvinDb/blog/' + foundBlog.htmlFilePath, function(err, data) {
            if (err) throw err;
            res.render('standard_blog_detail', {
              blogContent: data,
              foundBlog: foundBlog.reverse()
            })
          });
        }
      })
  } else {
    Blog.find({})
      .populate({
        path: "author",
        modal: "User"
      })
      .exec(function(err, foundBlogs) {
        if (err) {
          console.log(err)
          next(new errors.generic())
        } else {
          res.render('blogTheme', {
            foundBlogs:foundBlogs.reverse()
          })
        }
      })
  }
});

module.exports = router

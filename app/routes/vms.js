var express = require("express"),
  async = require("async"),
  fs = require('fs'),
  moment = require("moment-timezone"),
  errors = require("../error"),
  errorHandler = require('../errorHandler'),
  middleware = require("../middleware"),
  sharp = require('sharp'),
  request = require('request'),
  Gallery = require('./../models/Gallery'),
  Visitor= require('./../models/Visitor'),
  Blog = require('./../models/Blog'),
  User = require('./../models/User'),
  vmsController = require('./../controllers/vms.controller'),
  validator = require('validator')
  router = express.Router();
  Promise = require('bluebird')
  mongoose.Promise = Promise;

router.get('/test', (req, res, next) => {
  res.render('testGallery')
});

router.get('/', (req, res, next) => {
  Gallery.find({
    category: "results"
  }, (err, foundStudents) => {
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
  const name = req.body.name || ''
  const phone = req.body.phone || ''
  const emailId = req.body.emailId || ''
  const classs = req.body.classs || ''
  const date = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a') || ''
  const comments = req.body.comments || ''
  const address = req.body.address || ''
  const referral = req.body.referral || ''
  const school = req.body.school || ''
  const aim = req.body.aim || ''

  res.locals.flashUrl = '/vms'

  if(!name || validator.isEmpty(name)){
    return errorHandler.errorResponse('INVALID_NAME', next);
  }

  if(!phone || validator.isEmpty(phone) || !validator.isLength(phone, {min: 10, max: 10})){
    return errorHandler.errorResponse('INVALID_PHONE', next);
  }

  if(!emailId || !validator.isEmail(emailId)){
    return errorHandler.errorResponse('INVALID_EMAIL', next);
  }

  if(!classs || validator.isEmpty(classs)){
    return errorHandler.errorResponse('INVALID_CLASS_NAME', next);
  }

  if(!address || validator.isEmpty(address)){
    return errorHandler.errorResponse('INVALID_ADDRESS', next);
  }

  if(!referral || validator.isEmpty(referral)){
    return errorHandler.errorResponse('INVALID_REFERRAL', next);
  }

  if(!school || validator.isEmpty(school)){
    return errorHandler.errorResponse('INVALID_SCHOOL', next);
  }

  if(!aim || validator.isEmpty(aim)){
    return errorHandler.errorResponse('INVALID_AIM', next);
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

  // console.log('newVisitor', newVisitor);

  var promise = vmsController.addNewVisitor(newVisitor)
  promise.then(function (createdVisitor) {
    req.flash("success", 'Your response has been saved successfully')
    res.redirect('/vms')
  }, function (err) {
    next(err || 'SERVER_ERROR')
  })
});

router.delete('/:visitorId', (req, res, next) => {
  Visitor.findByIdAndRemove(req.params.visitorId, (err) => {
    if (!err) {
      req.flash('success', 'Entry deleted successfully')
      res.redirect('/admin/all')
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

router.get('/gallery/:category', function(req, res, next) {

  console.log(req.query)
  categoryObject = (req.params.category === 'all') ? {} : {
    category: req.params.category,
  }
  Gallery.find(categoryObject)
    .exec(function(err, gallery) {

      if (err) {
        console.log(err)
      } else {
        wr = fs.WriteStream('output1.jpg')
        const url = "cover.jpg"
        const pipeline = sharp(url).rotate().resize(300, 300)
        pipeline.pipe(wr)

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
      if(err){
        return console.log('err', err);
      } else {
        fs.readFile(__dirname + '/../../../HarvinDb/blog/' + foundBlog.htmlFilePath, function(err, data) {
          if (err) throw err;
          res.render('standard_blog_detail', {
            blogContent: data,
            foundBlog: foundBlog
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
    .exec(function (err, foundBlogs) {
      if(err){
        console.log(err)
        next(new errors.generic())
      } else {
        res.render('blogTheme', {foundBlogs})
      }
    })
  }
});

module.exports = router

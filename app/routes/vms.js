var express = require("express"),
  async = require("async"),
  fs=require('fs'),
  moment = require("moment-timezone"),
  errors = require("../error"),
  middleware = require("../middleware"),
  Visitor = require('./../models/Visitor'),
  sharp=require('sharp'),
  request=require('request'),
Gallery = require('./../models/Gallery'),
router = express.Router();

router.get('/new', (req, res, next) => {
  res.render('newVisitor');
});
router.get('/test', (req, res, next) => {
  res.render('testGallery');
});

router.get('/all', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  Visitor.find({}, (err, foundVisitors) => {
    if (!err && foundVisitors) {
      res.render('visitorDb', {
        visitors: foundVisitors
      });
    } else {
      console.log(err);
      next(new errors.generic());
    }
  });
});

router.get('/', (req, res, next) => {
  Gallery.find({}, (err, foundStudents) => {
    if (!err && foundStudents) {
      res.render('vmsLanding', {
        students: foundStudents
      });
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

router.get('/aboutus', (req, res, next) => {
  res.render('aboutus')
})

router.get('/centers', (req, res, next) => {


    res.render('centers')

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
  Gallery.find(categoryObject, function(err, gallery) {
      if (err) {
        console.log(err);
      }
    })
    .exec(function(err, gallery) {

      if (err) {
        console.log(err);
      } else {
          wr=fs.WriteStream('output1.jpg')
        const url = "cover.jpg"
        const pipeline = sharp(url).rotate().resize(300,300)
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
  //  res.render('gallery');
  console.log('hello gallery')

  Gallery.find({}, (err, foundImages) => {
    if (!err && foundImages) {
      res.render('gallery', {
        items: foundImages
      });
    }
  });
});

router.get('/results', (req, res, next) => {
Gallery.find({},(err,foundStudents)=>{
if(!err&&foundStudents)
  res.render('results',{students:foundStudents,testimonials:foundStudents})
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
  req.flash('success', 'Response recoreded successfully, We will get back to you soon!');
  res.redirect('/vms/careers');
})

//helper- class


module.exports = router;

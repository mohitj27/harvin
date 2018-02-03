var express = require("express"),
  async = require("async"),
  fs = require('fs'),
  moment = require("moment-timezone"),
  errors = require("../error"),
  middleware = require("../middleware"),
  Visitor = require('./../models/Visitor'),
  sharp = require('sharp'),
  request = require('request'),
  Gallery = require('./../models/Gallery'),
  Blog = require('./../models/Blog'),
  router = express.Router();

router.get('/test', (req, res, next) => {
  res.render('testGallery')
});

router.get('/all', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  Visitor.find({}, (err, foundVisitors) => {
    if (!err && foundVisitors) {
      res.render('visitorDb', {
        visitors: foundVisitors
      })
    } else {
      console.log(err)
      next(new errors.generic())
    }
  });
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

router.post('/vms', middleware.isLoggedIn, middleware.isCentre, (req, res, next) => {
  const name = req.body.name
  const phone = req.body.phone
  const emailId = req.body.emailId
  const classs = req.body.classs
  const date = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a')

  const newVisitor = new Visitor({
    name,
    phone,
    emailId,
    classs,
    date
  })

  newVisitor.save((err, createdVisitor) => {
    if (!err && createdVisitor) {
      req.flash("success", 'Your response has been saved successfully')
      res.redirect('/')
    } else {
      console.log(err)
      next(new errors.generic())
    }
  });

});

router.delete('/:visitorId', (req, res, next) => {
  Visitor.findByIdAndRemove(req.params.visitorId, (err) => {
    if (!err) {
      req.flash('success', 'Entry deleted successfully')
      res.redirect('/all')
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
//
// router.get('/blog/:title', (req, res, next) => {
//   console.log(req.query)
//   console.log('thisone')
//   // res.render('blog')
//
//   Blog.find({},(err,foundBlog)=>{
//     if(!err && foundBlog)
//     res.render('blog',{
//       foundBlog:foundBlog
//     })
//     else {
//       console.log(err)
//       next(new errors.generic())
//     }
//   })
//
// })
router.get('/blog', (req, res, next) => {
  console.log('title', req.query.title)
  if (req.query.title) {
    Blog.find({
      "blogTitle": req.query.title
    }, (err, foundBlog) => {
      if (err) console.log(err)
      res.render('standard_blog_detail', {
        foundBlog: foundBlog
      })

    })
  } else {
    Blog.find({}, (err, foundBlog) => {
      if (!err && foundBlog)
        res.render('blogTheme', {
          foundBlog: foundBlog
        })
      else {
        console.log(err)
        next(new errors.generic())
      }
    })
  }

})


//helper- class


module.exports = router

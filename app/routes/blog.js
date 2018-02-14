var express = require("express"),
  moment = require("moment-timezone"),
  Blog = require('../models/Blog'),
  errors = require("../error"),
  middleware = require("../middleware/index"),
  path = require('path'),
  fs = require('fs'),
  multer = require('multer'),
  app = express(),
  router = express.Router(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  promise=require('bluebird')


io.on('connection', function(socket) {
  console.log('connected')
});


const BLOG_DIR = path.normalize(__dirname + '/../../../HarvinDb/blog/');
const BLOG_IMAGE_DIR = path.normalize(__dirname + '/../../../HarvinDb/blogImage/');

router.get('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  res.render("newBlog");
});

router.get('/all', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  Blog.find({},(err,foundBlog)=>{
    if(err)console.log(err)
    else{
      res.render('blogList',{blogs:foundBlog.reverse()})
    }
  })
});

router.get('/:blogTitle', (req, res) => {
  Blog.findOne({
    blogTitle: req.params.blogTitle,
    author: req.user._id
  }, (err, foundBlog) => {
    if (err) console.log(err)
    else {
      res.json(foundBlog)
    }
  })
});

var storage = multer.diskStorage({
  destination: __dirname + '/../../../HarvinDb/blogImage/',
  filename: function(req, file, callback) {
    callback(null, Date.now() + "__" + file.originalname);
  }
});

router.post("/", middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {

  var upload = multer({
    storage: storage
  }).single('userFile');
  upload(req, res, function(err) {
    console.log('body', req.body);
    var coverImgName = path.basename(req.file.path);
    let blog_name = req.body.title.toLowerCase().replace(/ /g, '_').concat('.html')
    checkBlogDir()
    fs.writeFile(BLOG_DIR + blog_name, req.body.editordata, (err) => {
      if (err) throw err
    })
    const blogTitle = req.body.title
    let hashName = ''
    blogTitle.split(' ').forEach(function(word) {
      hashName += word.charAt(0)
    })
    const htmlFilePath = blog_name
    const uploadDate = moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY')
    Blog.findOneAndUpdate({
      blogTitle
    }, {
      $set: {
          htmlFilePath,
          hashName,
          coverImgName,
          author:req.user,
          publish:req.body.publish,
          draft:req.body.draft,
          uploadDate
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }, function(err, updatedBlog) {
      if(!err){
        console.log('updatedBlog', updatedBlog);
        res.redirect('/admin/blog/all')
      }
      else {
        res.redirect('/admin/blog/new')
        console.log('err', err);
      }

    })
  })

})

router.post('/:htmlFilePath/images', (req, res) => {
  console.log('body', req.body);
  // console.log('files', req.files);

  let htmlFilePath = req.params.htmlFilePath
  // htmlFilePath.concat('_').concat(req.body.uploadCounter);

  checkBlogDir()
  checkBlogImageDir()
  Blog.findOneAndUpdate({
      blogTitle: htmlFilePath
    }, {
      $addToSet: {
        blogImages: req.body.filename
      },
      $set: {
        author: req.user,
        uploadDate: moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY')
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    },
    function(err, updatedBlog) {
      if(!err){
        console.log('updatedBlog', updatedBlog);
        res.sendStatus(200)
      }
      else {
        console.log('err', err);
      }

    })
})
router.delete('/delete/:blogTitle',(req,res)=>{
  let removeBlogPromise=new Promise((resolve,reject)=>{
  Blog.remove({blogTitle:req.params.blogTitle},(err)=>{
    if(err)reject(err)
    else resolve()
  })
  })
  removeBlogPromise.then(()=>{
    res.send(200)
  })
})
function checkBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR)
    console.log("making blog dir")
  } else {
    console.log("not making blog dir")
  }
}

function checkBlogImageDir() {
  if (!fs.existsSync(BLOG_IMAGE_DIR)) {
    fs.mkdirSync(BLOG_IMAGE_DIR)
    console.log("making blog dir")
  } else {
    console.log("not making blog dir")
  }
}
module.exports = router;

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
  io = require('socket.io')(http)


io.on('connection', function(socket) {
  console.log('connected')
});


const BLOG_DIR = path.normalize(__dirname + '/../../../HarvinDb/blog/');
const BLOG_IMAGE_DIR = path.normalize(__dirname + '/../../../HarvinDb/blogImage/');

router.get('/', (req, res, next) => {
  res.render("newBlog");
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

router.post("/", (req, res, next) => {

  var upload = multer({
    storage: storage
  }).single('userFile');
  upload(req, res, function(err) {
    var coverImgName = path.basename(req.file.path);
    console.log('content', req.body)
    console.log('files', req.file);
    // console.log('path', );
    let blog_name = req.body.title.toLowerCase().replace(/ /g, '_').concat('.html')

    console.log(blog_name, 'blog_name1')
    checkBlogDir()

    fs.writeFile(BLOG_DIR + blog_name, req.body.editordata, (err) => {
      if (err) throw err
    })
    const blogTitle = req.body.title
    console.log(blogTitle)
    let hashName = ''
    blogTitle.split(' ').forEach(function(word) {
      hashName += word.charAt(0)
    })
    console.log('hash', hashName)
    const htmlFilePath = blog_name
    let blogObject = {
      blogTitle,
      htmlFilePath,
      hashName,
      coverImgName
    }
    Blog.create(blogObject, (err, createdBlog) => {
      if (err) console.log(err)
    })
    res.send(200)
  })

})

router.post('/:htmlFilePath/images', (req, res) => {
  console.log('body', req.body);
  // console.log('files', req.files);

  let htmlFilePath = req.params.htmlFilePath
  htmlFilePath.concat('_').concat(req.body.uploadCounter);

  checkBlogDir()
  checkBlogImageDir()
  Blog.findOneAndUpdate({
      htmlFilePath
    }, {
      $addToSet: {
        blogImages: req.body.filename
      },
      $set: {
        author: req.user
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    },
    function(err, updatedBlog) {
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

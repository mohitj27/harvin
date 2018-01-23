var express = require("express"),
  moment = require("moment-timezone"),
  Blog = require('../models/Blog'),
errors = require("../error"),
  middleware = require("../middleware"),
  path = require('path'),
  fs = require('fs')

router = express.Router()
const BLOG_DIR = path.normalize(__dirname + '/../../../HarvinDb/blog/');

router.get('/', (req, res, next) => {
  res.render("newBlog");
});

router.post("/", (req, res, next) => {
  console.log('content', req.body)
  let blog_name = req.body.title.toLowerCase().replace(/ /g, '_').concat('.html')
  console.log(blog_name, 'blog_name')
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR)
    console.log("making blog dir")
  } else {
    console.log("not making blog dir")
  }

  fs.writeFile(BLOG_DIR + blog_name, req.body.editordata, (err) => {
    if (err) throw err
  })
  const blogTitle = req.body.title
  const htmlFilePath = blog_name
  let blogObject = {
    blogTitle,
    htmlFilePath
  }
  Blog.create(blogObject, (err, createdBlog) => {
    if (err) console.log(err)
  })
  res.send(200)
})

router.post('/:htmlFilePath/images', (req, res) => {
  console.log('body', req.body);
  // console.log('files', req.);

})

router.get('/blog/:htmlFilePath',(req,res)=>{
  let htmlFilePath=req.params.htmlFilePath
  console.log(htmlFilePath)
  Blog.find({htmlFilePath},(err,foundBlog)=>{
    console.log(foundBlog)
    res.send(foundBlog)
  })
})


module.exports = router;

var express = require("express"),
  moment = require("moment-timezone"),
  Blog = require('../models/Blog'),
  errors = require("../error"),
  middleware = require("../middleware"),
  path = require('path'),
  fs = require('fs')

router = express.Router()
const BLOG_DIR = path.normalize(__dirname + '/../../../HarvinDb/blog/');
const BLOG_IMAGE_DIR = path.normalize(__dirname + '/../../../HarvinDb/blogImage/');

router.get('/', (req, res, next) => {
  res.render("newBlog");
});

router.post("/", (req, res, next) => {
  console.log('content', req.body)
  let blog_name = req.body.title.toLowerCase().replace(/ /g, '_').concat('.html')

  console.log(blog_name, 'blog_name')
  checkBlogDir()

  fs.writeFile(BLOG_DIR + blog_name, req.body.editordata, (err) => {
    if (err) throw err
  })
  const blogTitle = req.body.title
  console.log(blogTitle)
  let hashName=''
  blogTitle.split(' ').forEach(function(word){
  hashName+=word.charAt(0)
  })
  console.log('hash', hashName)
  const htmlFilePath = blog_name
  let blogObject = {
    blogTitle,
    htmlFilePath,
    hashName
  }
  Blog.create(blogObject, (err, createdBlog) => {
    if (err) console.log(err)
  })
  res.send(200)
})

router.post('/:htmlFilePath/images',(req,res)=>{
  let htmlFilePath = req.params.htmlFilePath
  let blog_name = htmlFilePath.replace('.html','').concat('/')
console.log(blog_name)
  checkBlogDir()
  checkBlogImageDir(blog_name)
  res.send(200)
})
function checkBlogDir(){
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR)
    console.log("making blog dir")
  } else {
    console.log("not making blog dir")
  }
}
function checkBlogImageDir(htmlFilePath){
  if (!fs.existsSync(BLOG_IMAGE_DIR)) {
    fs.mkdirSync(BLOG_IMAGE_DIR)
    console.log("making blog dir")
  } else {
    console.log("not making blog dir")
  }
}
module.exports = router;

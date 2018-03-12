const express = require('express'),
  moment = require('moment-timezone'),
  Blog = require('../models/Blog'),
  errors = require('../error'),
  middleware = require('../middleware/index'),
  path = require('path'),
  fs = require('fs'),
  app = express(),
  _ = require('lodash'),
  errorHandler = require('../errorHandler'),
  router = express.Router(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  promise = require('bluebird'),
  blogCont = require('../controllers/blog.controller'),
  fileController = require('../controllers/file.controller')

io.on('connection', function (socket) {
  // console.log('connected')
})

const BLOG_DIR = path.normalize(__dirname + '/../../../HarvinDb/blog/')
const BLOG_IMAGE_DIR = path.normalize(
  __dirname + '/../../../HarvinDb/blogImage/'
)

router.get(
  '/new',
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  (req, res, next) => {
    res.render('newBlog')
  }
)

router.get('/all', (req, res, next) => {
  Blog.find({})
    .sort({
      uploadDateUnix: -1
    })
    .exec((err, foundBlog) => {
      if (err) console.log(err)
      else {
        res.render('blogList', {
          blogs: foundBlog
        })
      }
    })
})

const editBlogPromise = function editBlogPromise (blogTitle) {
  return new Promise((resolve, reject) => {
    Blog.findOne(
      {
        blogTitle
      },
      (err, foundBlog) => {
        if (err) reject(err)
        else {
          resolve(foundBlog)
        }
      }
    )
  })
}

const fileOpenPromise = function fileOpenPromise (foundBlog) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      __dirname + '/../../../HarvinDb/blog/' + foundBlog.htmlFilePath,
      function (err, data) {
        if (err) reject(err)
        else resolve(data)
      }
    )
  })
}
router.get('/edit', async (req, res, next) => {
  const blogTitle = req.query.blogTitle
  try {
    const foundBlog = await editBlogPromise(blogTitle)
    const data = await fileOpenPromise(foundBlog)
    res.render('editBlog', {
      blogTitle: foundBlog.blogTitle,
      content: data
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})
router.get('/:blogTitle', (req, res) => {
  Blog.findOne(
    {
      blogTitle: req.params.blogTitle,
      author: req.user._id
    },
    (err, foundBlog) => {
      if (err) console.log(err)
      else {
        res.json(foundBlog)
      }
    }
  )
})

router.post(
  '/',
  middleware.isLoggedIn,
  middleware.isCentreOrAdmin,
  async (req, res, next) => {
    if (!req.files.length > 0) { return errorHandler.errorResponse('INVALID_FIELD', 'file', next)}
    const filePath = path.join(
      BLOG_IMAGE_DIR,
      Date.now() + '__' + req.files.userFile.name
    )
    try {
      await fileController.uploadFileToDirectory(filePath, req.files.userFile)
    } catch (err) {
      return next(err || 'Internal Server Error')
    }
    let blogTitle = req.body.title || ''
    if (!blogTitle) { return errorHandler.errorResponse('INVALID_FIELD', 'blog title', next)}
    blogTitle = _.trim(blogTitle)
    var coverImgName = path.basename(filePath)
    let blog_name = blogTitle
      .toLowerCase()
      .replace(/ /g, '_')
      .concat('.html')
    checkBlogDir()
    fs.writeFile(BLOG_DIR + blog_name, req.body.editordata, err => {
      if (err) throw err
    })
    let hashName = ''
    blogTitle.split(' ').forEach(function (word) {
      hashName += word.charAt(0)
    })
    const htmlFilePath = blog_name
    const uploadDate = moment(Date.now())
      .tz('Asia/Kolkata')
      .format('MMMM Do YYYY')
    Blog.findOneAndUpdate(
      {
        blogTitle
      },
      {
        $set: {
          htmlFilePath,
          hashName,
          coverImgName,
          author: req.user,
          publish: req.body.publish,
          draft: req.body.draft,
          uploadDate,
          uploadDateUnix: Date.now()
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      },
      function (err, updatedBlog) {
        if (!err) {
          // console.log('updatedBlog', updatedBlog)
          res.redirect('/admin/blog/all')
        } else {
          res.redirect('/admin/blog/new')
          console.log('err', err)
        }
      }
    )
    // })
  }
)

router.post('/:htmlFilePath/images', (req, res, next) => {
  // console.log('body', req.body)
  // console.log('files', req.files);

  let htmlFilePath = req.params.htmlFilePath || ''
  if (!htmlFilePath) { return errorHandler.errorResponse('INVALID_FIELD', 'blog title', next)}
  htmlFilePath = _.trim(htmlFilePath)
  let uploadDate = moment(Date.now())
    .tz('Asia/Kolkata')
    .format('MMMM Do YYYY')

  checkBlogDir()
  checkBlogImageDir()
  Blog.findOneAndUpdate(
    {
      blogTitle: htmlFilePath
    },
    {
      $addToSet: {
        blogImages: req.body.filename
      },
      $set: {
        author: req.user,
        uploadDate,
        uploadDateUnix: Date.now()
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    },
    function (err, updatedBlog) {
      if (!err) {
        // console.log('updatedBlog', updatedBlog)
        res.sendStatus(200)
      } else {
        console.log('err', err)
      }
    }
  )
})
router.delete('/delete/:blogTitle', (req, res) => {
  let removeBlogPromise = new Promise((resolve, reject) => {
    Blog.remove(
      {
        blogTitle: req.params.blogTitle
      },
      err => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
  removeBlogPromise.then(() => {
    res.sendStatus(200)
  })
})

function checkBlogDir () {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR)
    // console.log('making blog dir')
  } else {
    // console.log('not making blog dir')
  }
}

function checkBlogImageDir () {
  if (!fs.existsSync(BLOG_IMAGE_DIR)) {
    fs.mkdirSync(BLOG_IMAGE_DIR)
    // console.log('making blog dir')
  } else {
    // console.log('not making blog dir')
  }
}
router.post('/editmode/:blogTitle/:mode/:check', async (req, res) => {
  let result = await blogCont.updateBlogMode(
    req.params.blogTitle,
    req.params.mode,
    req.params.check
  )
  res.send(result)
})
module.exports = router

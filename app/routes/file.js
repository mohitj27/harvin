const express = require('express')
const path = require('path')
const moment = require('moment-timezone')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')
const validator = require('validator')
const fileController = require('../controllers/file.controller')
const linkController = require('../controllers/link.controller')
const topicController = require('../controllers/topic.controller')
const chapterController = require('../controllers/chapter.controller')
const subjectController = require('../controllers/subject.controller')
const classController = require('../controllers/class.controller')
const router = express.Router()

const FILE_DIR = path.normalize(__dirname + '/../../../HarvinDb/FileUploads/')
const LINK_GEN = path.normalize(__dirname + '/../../../HarvinDb/LinkUploads/')

// Form for uploading a file
router.get('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, (req, res, next) => {
  res.render('uploadFile')
})

// Handle file upload
router.post('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, async function (req, res, next) {
  res.locals.flashUrl = req.originalUrl

  const uploadDate = moment(Date.now()).tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a')
  const subjectName = req.body.subjectName || ''
  const chapterName = req.body.chapterName || ''
  const chapterDescription = req.body.chapterDescription
  const topicName = req.body.topicName || ''
  const topicDescription = req.body.topicDescription
  const className = req.body.className || ''

  if (!className || validator.isEmpty(className)) return errorHandler.errorResponse('INVALID_FIELD', 'class name', next)
  if (!subjectName || validator.isEmpty(subjectName)) return errorHandler.errorResponse('INVALID_FIELD', 'subject name', next)
  if (!chapterName || validator.isEmpty(chapterName)) return errorHandler.errorResponse('INVALID_FIELD', 'chapter name', next)
  if (!topicName || validator.isEmpty(topicName)) return errorHandler.errorResponse('INVALID_FIELD', 'topic name', next)

  const user = req.user

  const newTopic = {
    topicName,
    topicDescription
  }

  const newChapter = {
    chapterName,
    chapterDescription
  }

  const newSubject = {
    subjectName
  }

  const newClass = {
    className
  }

  try {
    if (req.files.length > 0) {
      const userFile = req.files.userFile
      const fileName = userFile.name
      const fileType = path.extname(userFile.name)
      const filePath = path.join(FILE_DIR, Date.now() + '__' + userFile.name)
      const fileSize = userFile.data.byteLength

      var newFile = {
        fileName,
        fileType,
        filePath,
        uploadDate,
        fileSize
      }
      await fileController.uploadFileToDirectory(filePath, userFile)
    }

    var createdFile
    if (newFile) {
      createdFile = await fileController.createNewFile(newFile)
    }

    var updatedTopic
    if (createdFile) {
      updatedTopic = await topicController.addFileToTopicByTopicNameAndUserId(newTopic, user, createdFile)
    } else {
      updatedTopic = await topicController.createOrUpdateTopicByTopicNameAndUserId(newTopic, user)
    }

    var updatedChapter = await chapterController.addTopicToChapterByChapterNameAndUserId(newChapter, user, updatedTopic)
    var updatedSubject = await subjectController.addChapterToSubjectBySubjectClassAndUserId(newSubject, className, user, updatedChapter)
    var updatedClass = await classController.addSubjectToClassByClassNameAndUserId(newClass, user, updatedSubject)
    updatedSubject = await subjectController.addClassToSubjectById(updatedSubject, updatedClass)
    updatedChapter = await chapterController.addSubjectToChapterById(updatedChapter, updatedSubject)
    updatedTopic = await topicController.addChapterToTopicById(updatedTopic, updatedChapter)

    if (createdFile) {
      await fileController.addTopicChapterSubjectClassToFileById(createdFile, updatedTopic, updatedChapter, updatedSubject, updatedClass)
    }

    req.flash('success', 'Successfully created new entries')
    res.redirect('/admin/files/new')
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/genlink',async (req,res,next)=>{
try {
  const foundLinks = await linkController.getAllLinks()
  res.render('genlink',{foundLinks})
} catch (e) {
  next(e)
} })

router.post('/genlink',async (req,res,next)=>{
  const link={linkTitle:req.body.linkTitle.replace(/\s/g,''),
              addedBy:req.user,
              uploadDate:moment(Date.now()).tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a'),
              filePath:LINK_GEN+'/'+req.files.linkFile.name}

try {
  const createdLink = await linkController.insertLink(link)
  await fileController.uploadFileToDirectory(LINK_GEN + '/'+req.files.linkFile.name,req.files.linkFile)
  const foundLinks= await linkController.getAllLinks()
  res.render('genlink',{foundLinks})

} catch (e) {
next(e)
}

})

router.get('/download/:linkTitle', async function (req, res, next) {
  const linkTitle = req.params.linkTitle || ''

  if (!linkTitle )
  return errorHandler.errorResponse('INVALID_FIELD', 'Link Title', next)
  try {
    const foundLink = await linkController.getDownloadFileByTitle(linkTitle)
    res.download(foundLink.filePath, path.parse(foundLink.filePath).base, (err) => {
      if (err) return next(err || 'Internal Server Error')
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})
router.delete('/deletelink/:linkTitle', async function (req, res, next) {
  const linkTitle = req.params.linkTitle || ''

  if (!linkTitle )
  return errorHandler.errorResponse('INVALID_FIELD', 'Link Title', next)
  try {
    const deletedLink= await linkController.delteLinkUsingTitle(linkTitle)
  res.send(deletedLink)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.get('/:fileId', async function (req, res, next) {
  const fileId = req.params.fileId || ''

  if (!fileId || !validator.isMongoId(fileId)) return errorHandler.errorResponse('INVALID_FIELD', 'File id', next)

  try {
    const foundFile = await fileController.findFileById(fileId)
    res.download(foundFile.filePath, foundFile.fileName, (err) => {
      if (err) return next(err || 'Internal Server Error')
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})


module.exports = router

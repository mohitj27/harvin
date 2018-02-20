const express = require('express')
const multer = require('multer')
const moment = require('moment-timezone')
const middleware = require('../middleware')
const errorHandler = require('../errorHandler')
const path = require('path')
const validator = require('validator')
const assignmentController = require('../controllers/assignment.controller')
const batchController = require('../controllers/batch.controller')
const userController = require('../controllers/user.controller')
const router = express.Router()

// assignment uplaod helper
// setting disk storage for uploaded assignment
var storage = multer.diskStorage({
  destination: path.join(__dirname, '/../../../HarvinDb/assignments/'),
  filename: function (req, file, callback) {
    callback(null, Date.now() + '__' + file.originalname)
  }
})

router.get('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    var foundAssignments = await assignmentController.findAssignmentsByUserId(req.user)
    foundAssignments = await assignmentController.populateFieldOfAssignment(foundAssignments, 'batch')
    return res.render('assignments', {
      foundAssignments
    })
  } catch (e) {
    return next(e)
  }
})

router.get('/new', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  try {
    const foundBatches = await batchController.findBatchByUserId(req.user)
    return res.render('newAssignment', {
      batches: foundBatches
    })
  } catch (e) {
    next(e)
  }
})

router.post('/', middleware.isLoggedIn, middleware.isCentreOrAdmin, function (req, res, next) {
  res.locals.flashUrl = req.headers.referer

  var upload = multer({
    storage: storage
  })
    .single('userFile')

  upload(req, res, async function (err) {
    if (err) return next(err)
    if (!req.file) return errorHandler.errorResponse('INVALID_FIELD', 'file', next)

    const filePath = req.file.path
    const assignmentName = req.body.assignmentName || ''
    const uploadDate = moment(Date.now()).tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a')
    const lastSubDate = req.body.lastSubDate || ''
    const batchId = req.body.batchName || ''

    if (!assignmentName || validator.isEmpty(assignmentName)) return errorHandler.errorResponse('INVALID_FIELD', 'assignment name', next)
    if (!lastSubDate || validator.isEmpty(lastSubDate)) return errorHandler.errorResponse('INVALID_FIELD', 'last submission date', next)
    if (!batchId || validator.isEmpty(batchId)) return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)

    try {
      let foundBatch = await batchController.findBatchById(batchId)
      var newAssignment = {
        assignmentName,
        uploadDate,
        lastSubDate,
        filePath,
        batch: foundBatch,
        addedBy: req.user
      }

      let createdAsssignment = await assignmentController.createAssignment(newAssignment)
      req.flash('success', createdAsssignment.assignmentName + ' created Successfully')
      return res.redirect('/admin/assignment')
    } catch (e) {
      next(e)
    }
  })
})

router.get('/:assignmentId/edit', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  res.locals.flashUrl = req.headers.referer

  const assignmentId = req.params.assignmentId || ''
  if (!assignmentId || !validator.isMongoId(assignmentId)) return errorHandler.errorResponse('INVALID_FIELD', 'assignment id', next)

  try {
    const foundBatches = await batchController.findBatchByUserId(req.user)
    let foundAssignment = await assignmentController.findAssignmentsId(assignmentId)
    foundAssignment = await assignmentController.populateFieldOfAssignment(foundAssignment, 'batch')
    res.render('editAssignment', {
      assignment: foundAssignment,
      batches: foundBatches
    })
  } catch (err) {
    next(err)
  }
})

router.put('/:assignmentId', middleware.isLoggedIn, middleware.isCentreOrAdmin, async (req, res, next) => {
  const assignmentId = req.params.assignmentId || ''
  if (!assignmentId || !validator.isMongoId(assignmentId)) return errorHandler.errorResponse('INVALID_FIELD', 'assignment id', next)

  const assignmentName = req.body.assignmentName || ''
  const uploadDate = moment(Date.now()).tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a')
  const lastSubDate = req.body.lastSubDate || ''
  const batchId = req.body.batchName || ''

  if (!assignmentName || validator.isEmpty(assignmentName)) return errorHandler.errorResponse('INVALID_FIELD', 'assignment name', next)
  if (!lastSubDate || validator.isEmpty(lastSubDate)) return errorHandler.errorResponse('INVALID_FIELD', 'last submission date', next)
  if (!batchId || validator.isEmpty(batchId)) return errorHandler.errorResponse('INVALID_FIELD', 'batch', next)

  const newAssignment = {
    assignmentName,
    uploadDate,
    lastSubDate,
    batchId
  }

  try {
    const updatedAssignment = await assignmentController.updateAssignmentByAssignmentAndUserId(assignmentId, req.user, newAssignment)
    req.flash('success', assignmentName + ' updated Successfully')
    return res.redirect('/admin/assignment')
  } catch (err) {
    next(err)
  }
})

router.get('/:username/assignments', async (req, res, next) => {
  // TODO: filter assignments, provide only those assignments of the batch in which user belongs

  const username = req.params.username || ''
  if (!username || validator.isEmpty(username)) return errorHandler.errorResponse('INVALID_FIELD', 'username', next)

  try {
    let userBatch = await userController.findBatchOfUserByUsername(username, next)

    if (!userBatch) {
      return errorHandler.errorResponse('NOT_FOUND', 'user batch', next)
    }

    let foundAssignments = await assignmentController.findAssignmentsOfBatchByBatchId(userBatch._id)
    res.send({
      assignments: foundAssignments
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:assignmentId', async function (req, res, next) {
  const assignmentId = req.params.assignmentId || ''
  if (!assignmentId || !validator.isMongoId(assignmentId)) return errorHandler.errorResponse('INVALID_FIELD', 'Assignment id', next)

  try {
    const foundAssignment = await assignmentController.findAssignmentById(assignmentId)
    res.download(foundAssignment.filePath, foundAssignment.assignmentName, (err) => {
      if (err) return next(err)
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router

const express = require('express'),
  router = express.Router(),
  enquiryController = require('./../controllers/enquiry.controller'),
  errorHandler = require('../errorHandler'),
  validator = require('validator'),
  middleware = require('../middleware')

router.get('/', middleware.isLoggedIn, async (req, res, next) => {
  try {
    let foundEnquiries = await enquiryController.findAllEnquiries()
    res.render('enquiriesDb', {
      enquiries: foundEnquiries.reverse()
    })
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.delete('/:enquiryId', middleware.isLoggedIn, async (req, res, next) => {
  const enquiryId = req.params.enquiryId || ''
  if (!enquiryId || !validator.isMongoId(enquiryId)) {
    return errorHandler.errorResponse('INVALID_FIELD', 'enquiry id', next)
  }

  try {
    let foundEnquiry = await enquiryController.findEnquiryById(enquiryId)

    if (!foundEnquiry) {
      return errorHandler.errorResponse('NOT_FOUND', 'Enquriy', next)
    } else {
      foundEnquiry.remove()
    }
    res.sendStatus(200)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})

router.post('/', async (req, res, next) => {
  console.log('req body - ',req.body)
  const date = Date.now()
  console.log("an enquiry has come");
  try {
    req.body.date = date
    await enquiryController.newEnquiry(req.body)
    res.sendStatus(200)
  } catch (err) {
    next(err || 'Internal Server Error')
  }
})
module.exports = router

const express = require('express')
const topicController = require('../controllers/topic.controller')
const router = express.Router()

router.get('/:topicName', async function (req, res, next) {
  const topicName = req.params.topicName

  try {
    const foundTopic = await topicController.findTopicByTopicNameAndUserId(topicName, req.user)
    return res.json({
      topic: foundTopic
    })
  } catch (e) {
    next(e)
  }
})

module.exports = router

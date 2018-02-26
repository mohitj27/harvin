const errorHandler = require('../errorHandler');
const Topic = require('./../models/Topic');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const findTopicByTopicNameAndUserId = function (topicName, user) {
  return new Promise(function (resolve, reject) {
    Topic.findOneAsync({
        topicName,
        addedBy: user
      })
      .then(foundTopic => resolve(foundTopic))
      .catch(err => reject(err))
  });
}

const addFileToTopicByTopicNameAndUserId = function (newTopic, user, createdFile) {
  return new Promise(function (resolve, reject) {
    Topic.findOneAndUpdateAsync({
        topicName: newTopic.topicName,
        addedBy: user
      }, {
        $addToSet: {
          files: createdFile
        },
        $set: {
          topicDescription: newTopic.topicDescription,
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }, )
      .then(updatedTopic => resolve(updatedTopic))
      .catch(err => reject(err))
  });
}

const createOrUpdateTopicByTopicNameAndUserId = function (newTopic, user) {
  return new Promise(function (resolve, reject) {
    Topic.findOneAndUpdateAsync({
        topicName: newTopic.topicName,
        addedBy: user
      },{
        $set: {
          topicDescription: newTopic.topicDescription,
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }, )
      .then(updatedTopic => resolve(updatedTopic))
      .catch(err => reject(err))
  });
}

const addChapterToTopicById = function (updatedTopic, updatedChapter) {
  return new Promise(function (resolve, reject) {
    Topic.findByIdAndUpdateAsync(updatedTopic._id, {
        $set: {
          chapter: updatedChapter
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }, )
      .then(updatedTopic => resolve(updatedTopic))
      .catch(err => reject(err))
  });
}

module.exports = {
  findTopicByTopicNameAndUserId,
  addFileToTopicByTopicNameAndUserId,
  addChapterToTopicById,
  createOrUpdateTopicByTopicNameAndUserId
}

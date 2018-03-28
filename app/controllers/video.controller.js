const errorHandler = require('../errorHandler')
const Video = require('./../models/Video')
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise

const newVideo = function (newVideoObj) {
  return new Promise(function (resolve, reject) {
    Video.create(newVideoObj)
      .then(createdVideo => resolve(createdVideo))
      .catch(err => reject(err))
  })
}

const findAllVideos = function () {
  return new Promise(function (resolve, reject) {
    Video.find()
      .then(foundVideos => resolve(foundVideos))
      .catch(err => reject(err))
  })
}

const findVideoById = function (VideoId) {
  return new Promise(function (resolve, reject) {
    Video.findById(VideoId)
      .then(foundVideo => resolve(foundVideo))
      .catch(err => reject(err))
  })
}

module.exports = {
  newVideo,
  findAllVideos,
findVideoById
}

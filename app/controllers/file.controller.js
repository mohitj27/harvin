const File = require('./../models/File')
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise

const createNewFile = function (newFile) {
  return new Promise(function (resolve, reject) {
    File.createAsync(newFile)
      .then(createdFile => resolve(createdFile))
      .catch(err => reject(err))
  })
}

const findAllFiles = function () {
  return new Promise(function (resolve, reject) {
    File
      .findAsync()
      .then(createdFile => resolve(createdFile))
      .catch(err => reject(err))
  })
}

const addTopicChapterSubjectClassToFileById = function (createdFile, updatedTopic, updatedChapter, updatedSubject, updatedClass) {
  return new Promise(function (resolve, reject) {
    File.findByIdAndUpdateAsync(createdFile._id, {
      $set: {
        topic: updatedTopic,
        chapter: updatedChapter,
        subject: updatedSubject,
        class: updatedClass
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    })
      .then(updatedFile => resolve(updatedFile))
      .catch(err => reject(err))
  })
}

const findFileById = function (fileId) {
  return new Promise(function (resolve, reject) {
    File.findByIdAsync(fileId)
      .then(foundFile => resolve(foundFile))
      .catch(err => reject(err))
  })
}

const populateFieldsInFiles = function (files, path) {
  return new Promise(function (resolve, reject) {
    File
      .deepPopulate(files, path)
      .then(populatedFiles => resolve(populatedFiles))
      .catch(err => reject(err))
  })
}

module.exports = {
  createNewFile,
  addTopicChapterSubjectClassToFileById,
  findFileById,
  findAllFiles,
  populateFieldsInFiles
}

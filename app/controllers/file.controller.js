const errorHandler = require('../errorHandler');
const File = require('./../models/File');
const Class = require('./../models/Class');
const Subject = require('./../models/Subject');
const Chapter = require('./../models/Chapter');
const Topic = require('./../models/Topic');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const createNewFile = function (newFile) {
  return new Promise(function(resolve, reject) {
    File.createAsync(newFile)
    .then(createdFile => resolve(createdFile))
    .catch(err => reject(err))
  });
}

const addTopicChapterSubjectClassToFileById = function (createdFile, updatedTopic, updatedChapter, updatedSubject, updatedClass) {
  return new Promise(function (resolve, reject) {
    File.findByIdAndUpdateAsync(createdFile._id, {
        $set: {
          topic: updatedTopic,
          chapter: updatedChapter,
          subject: updatedSubject,
          class: updatedClass,
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }, )
      .then(updatedFile => resolve(updatedFile))
      .catch(err => reject(err))
  });
}

module.exports = {
  createNewFile,
  addTopicChapterSubjectClassToFileById
}

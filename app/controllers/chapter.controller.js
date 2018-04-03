const errorHandler = require('../errorHandler');
const Chapter = require('./../models/Chapter');
Promise = require('bluebird');
mongoose = require('mongoose');
mongoose.Promise = Promise;

const findChapterByChapterNameAndUserId = function (chapterName, user) {
  return new Promise(function (resolve, reject) {
    Chapter.findOneAsync({ chapterName, addedBy: user })
    .then(foundChapter => resolve(foundChapter))
    .catch(err => reject(err));
  });
};

const addTopicToChapterByChapterNameAndUserId = function (newChapter, user, updatedTopic) {
  return new Promise(function (resolve, reject) {
    Chapter.findOneAndUpdateAsync({
        chapterName: newChapter.chapterName,
        addedBy: user,
      }, {
        $addToSet: {
          topics: updatedTopic,
        },
        $set: {
          chapterDescription: newChapter.chapterDescription,
        },
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },)
      .then(updatedChapter => resolve(updatedChapter))
      .catch(err => reject(err));
  });
};

const addSubjectToChapterById = function (updatedChapter, updatedSubject) {
  return new Promise(function (resolve, reject) {
    Chapter.findByIdAndUpdateAsync(updatedChapter._id, {
        $set: {
          subject: updatedSubject,
        },
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },)
      .then(updatedChapter => resolve(updatedChapter))
      .catch(err => reject(err));
  });
};

module.exports = {
  findChapterByChapterNameAndUserId,
  addTopicToChapterByChapterNameAndUserId,
  addSubjectToChapterById,
};

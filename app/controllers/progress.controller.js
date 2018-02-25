const Progress = require('./../models/Progress')
Promise = require('bluebird')
const mongoose = require('mongoose')
const batchController = require('../controllers/batch.controller')
const _ = require('lodash')
mongoose.Promise = Promise

const createProgress = function (newProgress) {
  return new Promise(function (resolve, reject) {
    Progress
      .createAsync(newProgress)
      .then(createdProgress => resolve(createdProgress))
      .catch(err => reject(err))
  })
}

const createProgressesForBatch = async function (batch) {
  batch = batchController.populateFieldsInBatches(batch, ['subjects'])
  let subjects = batch.subjects
  let chapterIds = []
  let progresses = []

  _.forEach(subjects, subject => {
    chapterIds = _.concat(chapterIds, subject.chapters)
  })

  for (let chapter of chapterIds) {
    let createdProgress = await createProgress({
      chapter
    })
    progresses = _.concat(progresses, createdProgress)
  }

  return progresses
}

module.exports = {
  createProgress,
  createProgressesForBatch
}

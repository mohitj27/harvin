const Batch = require('./../models/Batch');
Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const findAllBatch = function () {
  return new Promise(function (resolve, reject) {
    Batch.findAsync({})
      .then(foundBatches => resolve(foundBatches))
      .catch(err => reject(err));
  });
};

const createOrUpdateSubjectsToBatchByBatchNameAndUserId = function (newBatch, user, subjects) {
  return new Promise(function (resolve, reject) {
    Batch.findOneAndUpdateAsync({
      batchName: newBatch.batchName,
    }, {
      $set: {
        subjects: subjects,
        batchDesc: newBatch.batchDesc,
        addedBy: user,
      },
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })
      .then(updatedBatch => resolve(updatedBatch))
      .catch(err => reject(err));
  });
};

const populateFieldsInBatches = function (batches, path) {
  return new Promise(function (resolve, reject) {
    Batch
      .deepPopulate(batches, path)
      .then(populatedBatches => resolve(populatedBatches))
      .catch(err => reject(err));
  });
};

const findBatchById = function (batchId) {
  return new Promise(function (resolve, reject) {
    Batch.findByIdAsync(batchId)
      .then(foundBatch => resolve(foundBatch))
      .catch(err => reject(err));
  });
};

const findBatchByBatchName = function (batchName) {
  return new Promise(function (resolve, reject) {
    Batch.findOneAsync({
      batchName: batchName,
    })
      .then(foundBatch => {
        resolve(foundBatch);
      })
      .catch(err => reject(err));
  });
};

const findBatchByUserId = function (user) {
  return new Promise(function (resolve, reject) {
    Batch.findAsync({
      addedBy: user,
    })
      .then(foundBatch => {
        resolve(foundBatch);
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  findAllBatch,
  findBatchById,
  findBatchByBatchName,
  findBatchByUserId,
  createOrUpdateSubjectsToBatchByBatchNameAndUserId,
  populateFieldsInBatches,
};

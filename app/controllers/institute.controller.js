const errorHandler = require('../errorHandler');
const Institute = require('./../models/Institute');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const _ = require('lodash');
mongoose.Promise = Promise;

const createInstitute = function (newInstitute) {
  return new Promise(function (resolve, reject) {
    Institute.createAsync(newInstitute)
      .then(createdInstitute => resolve(createdInstitute))
      .catch(err => reject(err));
  });
};

const findAllInstitutes = function () {
  return new Promise(function (resolve, reject) {
    Institute.findAsync()
      .then(foundInstitutes => resolve(foundInstitutes))
      .catch(err => reject(err));
  });
};

const findInstituteById = function (instituteId) {
  return new Promise(function (resolve, reject) {
    Institute.findByIdAsync(instituteId)
      .then(foundInstitute => resolve(foundInstitute))
      .catch(err => reject(err));
  });
};

const findInstituteByName = function (instituteName) {
  return new Promise(function (resolve, reject) {
    Institute.findOneAsync({
      instituteName,
    })
      .then(foundInstitute => resolve(foundInstitute))
      .catch(err => reject(err));
  });
};

const removeCenterFromInstituteById = (institute, center) =>
   new Promise((resolve, reject) => {
    Institute.findByIdAndUpdateAsync(institute.id, {
      $pull: {
        centers: center.id,
      },
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    })
      .then(updatedInstitute => resolve(updatedInstitute))
      .catch(err => reject(err));
  });

const updateFieldsInInstituteById = function (institute, addToSetFields, setFields) {
  if (_.isEmpty(addToSetFields)) {
    return new Promise(function (resolve, reject) {
      Institute.findByIdAndUpdateAsync(institute.id, {
        $set: setFields,
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
        .then(updatedInstitute => resolve(updatedInstitute))
        .catch(err => reject(err));
    });
  } else if (_.isEmpty(setFields)) {
    return new Promise(function (resolve, reject) {
      Institute.findByIdAndUpdateAsync(institute._id, {
        $addToSet: addToSetFields,
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
        .then(updatedInstitute => resolve(updatedInstitute))
        .catch(err => reject(err));
    });
  } else {
    return new Promise(function (resolve, reject) {
      Institute.findByIdAndUpdateAsync(institute._id, {
        $set: setFields,
        $addToSet: addToSetFields,
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
        .then(updatedInstitute => resolve(updatedInstitute))
        .catch(err => reject(err));
    });
  }
};

module.exports = {
  createInstitute,
  updateFieldsInInstituteById,
  findAllInstitutes,
  findInstituteById,
  findInstituteByName,
  removeCenterFromInstituteById,
};

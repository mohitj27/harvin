const errorHandler = require('../errorHandler');
const Class = require('./../models/Class');
Promise = require('bluebird')
mongoose = require('mongoose')
mongoose.Promise = Promise;

const findAllClasses = function () {
  return new Promise(function(resolve, reject) {
    Class.findAsync()
    .then(foundClasses => resolve(foundClasses))
    .catch(err => reject(err))
  });
}

const findClassByName = function (className) {
  return new Promise(function(resolve, reject) {
    Class.findOneAsync({className})
    .then(foundClass => resolve(foundClass))
    .catch(err => reject(err))
  });
}

const findClassesByUserId = function (user) {
  return new Promise(function(resolve, reject) {
    Class.findAsync({addedBy: user})
    .then(foundClasses => resolve(foundClasses))
    .catch(err => reject(err))
  });
}

const addSubjectToClassByClassNameAndUserId = function (newClass, user, updatedSubject) {
  return new Promise(function (resolve, reject) {
    Class.findOneAndUpdateAsync({
        className: newClass.className,
        addedBy: user
      }, {
        $addToSet: {
          subjects: updatedSubject
        }
      }, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }, )
      .then(updatedClass => resolve(updatedClass))
      .catch(err => reject(err))
  });
}


module.exports = {
  findAllClasses,
  findClassByName,
  findClassesByUserId,
  addSubjectToClassByClassNameAndUserId
}

const errorHandler = require('../errorHandler/index');
const Course = require('./../models/Course');
Promise = require('bluebird')
const mongoose = require('mongoose')
mongoose.Promise = Promise;

const findAllCourses = () => {
  return new Promise((resolve, reject) => {
    Course.find({}, (err, foundCourses) => {
      if (err) reject(err)
      else resolve(foundCourses)
    })
  })
}

const findCourseById = (courseId) => {
  return new Promise((resolve, reject) => {
    Course.findById(courseId)
    .then(foundCourse => resolve(foundCourse))
    .catch(err => reject(err))
  })
}

const findOneCourseUsingName = (courseName) => {
  return new Promise((resolve, reject) => {
    Course.findOne({
      courseName
    }, (err, foundCourse) => {
      if (err) reject(err)
      else resolve(foundCourse)
    })
  })
}
const insertInCourse = (course) => {
  return new Promise((resolve, reject) => {
    Course.updateOne({
      courseName: course.courseName
    }, course, {
      upsert: true
    }, (err, result) => {
      if (err) reject(err)
      else {
        console.log("naman")
        resolve(true)
      }
    })
  })
}
const deleteOneCourse = (courseName) => {
  return new Promise((resolve, reject) => {
    resolve(courseName)
  })
}
module.exports = {
  findAllCourses,
  findCourseById,
  insertInCourse,
  deleteOneCourse,
  findOneCourseUsingName
}

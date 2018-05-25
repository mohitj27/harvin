const errorHandler = require("../errorHandler/index");
const Course = require("./../models/Course");
Promise = require("bluebird");
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const findAllCourses = () =>
  new Promise((resolve, reject) => {
    Course.find({}, (err, foundCourses) => {
      if (err) reject(err);
      else resolve(foundCourses);
    });
  });

const findCourseById = courseId =>
  new Promise((resolve, reject) => {
    Course.findById(courseId)
      .then(foundCourse => resolve(foundCourse))
      .catch(err => reject(err));
  });

const findOneCourseUsingName = courseName =>
  new Promise((resolve, reject) => {
    Course.findOne(
      {
        courseUrl: courseName
      },
      (err, foundCourse) => {
        if (err) reject(err);
        else resolve(foundCourse);
      }
    );
  });

const insertInCourse = course =>
  new Promise((resolve, reject) => {
    Course.create(course)
      .then(createdCourse => resolve(createdCourse))
      .catch(err => reject(err));
  });

const updateCourse = course =>
  new Promise((resolve, reject) => {
    Course.updateOne(
      {
        _id: course._id
      },
      course,
      {
        upsert: true
      },
      (err, result) => {
        if (err) reject(err);
        else {
          resolve(true);
        }
      }
    );
  });

const deleteOneCourse = courseName =>
  new Promise((resolve, reject) => {
    Course.remove({ courseName }, err => {
      if (err) reject(err);
      resolve(courseName);
    });
  });

module.exports = {
  findAllCourses,
  findCourseById,
  insertInCourse,
  updateCourse,
  deleteOneCourse,
  findOneCourseUsingName
};

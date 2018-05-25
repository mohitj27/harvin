const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseUrl: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseImage: {
    type: String,
    required: true
  },
  courseTimings: {
    type: String,
    required: true
  },
  courseStartingFrom: {
    type: String,
    required: true
  },
  courseDescription: {
    type: String,
    required: true
  },
  courseFor: {
    type: String,
    required: true
  },
  courseAdmissionThrough: {
    type: String,
    required: true
  },
  courseFrequency: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Course", courseSchema);

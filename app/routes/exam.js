var express = require("express"),
async = require("async"),

Batch = require("../models/Batch"),
Subject = require("../models/Subject"),
Exam = require("../models/Exam"),
errors = require("../error"),
middleware = require("../middleware"),

router = express.Router();

router.get("/", (req, res, next) => {
    Exam.find({},(err, foundExams) => {
        if(!err && foundExams){
            res.render("exams", {foundExams: foundExams});
        }
        else{
            next(new errors.generic);
        }
    });
});

router.get("/new", (req, res, next) => {
    res.render("newExam");
});

router.post("/", (req, res, next) => {
    var examName = req.body.examName;
    var examDate = req.body.examDate;
    var examType = req.body.examType;
    var maximumMarks = req.body.maxMarks;
    var passingMarks = req.body.passMarks;
    var negativeMarks = req.body.negMarks;
    console.log(examName)

    var newExam = {
        examName,
        examDate,
        examType,
        maximumMarks,
        passingMarks,
        negativeMarks,
    };

    Exam.create(newExam, function(err, createdExam){
        if(!err && createdExam){
            req.flash("success", examName + " created Successfully");
            res.redirect("/exams");
        }else
            console.log(err)
    });

});

module.exports = router;


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

    var newExam = {
        examName,
        examDate,
        examType,
        maximumMarks,
        passingMarks,
        negativeMarks,
    };

    Exam.create(newExam, (err, createdExam) => {
        if(!err && createdExam){
            req.flash("success", examName + " created Successfully");
            res.redirect("/exams");
        }else{
            console.log(err);
            next(new errors.generic);
        }
    });

});

router.get("/:examId/edit", (req, res, next) => {
    var examId = req.params.examId;
    Exam.findById(examId, (err, foundExam) => {
        if(!err && foundExam){
            res.render("editExam", {exam: foundExam});
        }
    });
});

router.put("/:examId", (req, res, next) => {
    var examId = req.params.examId;
    var examName = req.body.examName;
    var examDate = req.body.examDate;
    var examType = req.body.examType;
    var maximumMarks = req.body.maxMarks;
    var passingMarks = req.body.passMarks;
    var negativeMarks = req.body.negMarks;

    Exam.findByIdAndUpdate(examId,
         {
             $set:{
                examName,
                examDate,
                examType,
                maximumMarks,
                passingMarks,
                negativeMarks
            }
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        },
        (err, updatedExam) => {
            if(!err && updatedExam){
                req.flash("success", examName + " updated Successfully");
                res.redirect("/exams")
            }
            else{
                console.log(err);
                next(new errors.generic)
            }
        }
    );
});

router.delete("/:examId", (req, res, next) =>{
    var examId = req.params.examId;
    Exam.findByIdAndRemove(examId, (err, removedExam) => {
        if(!err && removedExam){
            req.flash("success", removedExam.examName + " removed Successfully");
            res.redirect("/exams");
        }
        else{
            console.log(err);
            next(new errors.generic)
        }
    });
});

module.exports = router;


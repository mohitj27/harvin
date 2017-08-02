var express = require("express"),
    router = express.Router()
    Batch = require("../models/Batch")
    Subject = require("../models/Subject")
    errors = require("../error");
    async = require("async"),

router.get("/",function(req, res, next){
    Batch.find({}, function(err, foundBatches){
        if(err) {
            console.log(err);
            next(new errors.notFound)
        }
        else{
            Subject.find({},function(err,foundSubjects){
                if(err) {
                    console.log(err);
                    next(new errors.notFound)
                }
                else{
                    res.render("batch",{batches:foundBatches, subjects:foundSubjects});
                }
            })
        }            
    });
});

//finding batch with given batchName and populating the subject field in it
router.get("/:batchName", function(req, res, next){
    Batch.findOne({batchName: req.params.batchName}, function(err, foundBatch){
        if(err) {
            console.log(err);
            next(new errors.generic)
        }
    })
    .populate(
        {
            path:"subject",
            model:"Subject"
        }
    )
    .exec(function(err, batch){
        if(err){
             req.flash("error","Couldn't find the chosen Batch");
			 res.redirect("/batch");
		}
		else{
            res.json({batch:batch});
		}
    });
});

router.post("/update",function(req, res, next){
    var subjectName = req.body.subjectName;
    var batchName = req.body.batchName;

    async.waterfall(
        [
            function (callback) {
                Subject.find({subjectName:subjectName}, function(err, foundSubjects){
                    if(!err && foundSubjects) {
                        callback(null, foundSubjects)
                        
                    }else{
                        console.log(err);
                        callback(err);
                    }
                });
            },
    
            function (foundSubjects, callback) {
                Batch.findOneAndUpdate(
                    { batchName:batchName },
                    { $set:{ batchName: batchName, subject: foundSubjects} },
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                    function (err, createdBatch) {
                        if(!err && createdBatch){
                           req.flash("success", "Batch updated successfully");
                           res.redirect("/batch")
                        }
                    }
                );
            }
        ],
        function (err, result) {
            if(err){ {batchName:batchName}
                console.log(err)
                next(new errors.generic)
            }
        }
    );
    

    
});



module.exports = router;

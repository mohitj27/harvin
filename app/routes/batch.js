var express = require("express"),
    router = express.Router()
    Batch = require("../models/Batch")
    Subject = require("../models/Subject")

router.get("/",function(req, res){
    Batch.find({}, function(err, foundBatches){
            if(err) console.log(err);
            else{
                Subject.find({},function(err,foundSubjects){
                    if(err) console.log(err);
                    else{
                        res.render("batch",{batches:foundBatches, subjects:foundSubjects});
                    }
                })
            }            
        }
    )
});

//finding batch with given batchName and populating the subject field in it
router.get("/:batchName", function(req, res){
    Batch.findOne({batchName: req.params.batchName}, function(err, foundBatch){
        if(err) {
            console.log(err)
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
			//  console.log(err);
             req.flash("error","Couldn't find the chosen Batch");
			 res.redirect("/batch");
		}
		else{
            res.json({batch:batch});
		}
    });
});

router.post("/update",function(req, res){
    var subjectName = req.body.subjectName;
    var batchName = req.body.batchName;

    Batch.findOne({batchName:batchName}, function(err, foundBatch){
        if(err){
            console.log(err)
            req.flash("error", "Something went wrong");
            res.redirect("/batch")
        }else{
            if(foundBatch!=null){
                Subject.find({subjectName:subjectName}, function(err, foundSubject){
                    if(err){
                        console.log(err)
                        req.flash("error", "Something went wrong");
                        res.redirect("/batch");
                    }else{
                        if(foundSubject!=null){
                            console.log(foundSubject.length);
                            const doc = {
                                subject:foundSubject
                            }
                            Batch.update({_id:foundBatch._id},doc , function(err){
                                if(err){
                                    console.log(err)
                                    req.flash("error", "Something went wrong");
                                    res.redirect("/batch")
                                }
                                else{
                                    req.flash("success", "Batch updated successfully");
                                    res.redirect("/batch")
                                }
                            });
                        }
                    }
                });
            }else{
                Batch.create(
                    {
                        batchName:batchName
                    },
                    function(err, createdBatch){
                        if(err){
                            console.log(err)
                            req.flash("error", "Something went wrong");
                            res.redirect("/batch")
                        }
                        else{
                            Subject.find({subjectName:subjectName}, function(err, foundSubject){
                                if(err){
                                    console.log(err)
                                    req.flash("error", "Something went wrong");
                                    res.redirect("/batch")
                                }else{
                                    if(foundSubject!=null){
                                        console.log(foundSubject.length);
                                        const doc = {
                                            subject:foundSubject
                                        }
                                        Batch.update({_id:createdBatch._id},doc , function(err){
                                            if(err){
                                                console.log(err)
                                                req.flash("error", "Something went wrong");
                                                res.redirect("/batch")
                                            }
                                            else{
                                                req.flash("success", "Batch updated successfully");
                                                res.redirect("/batch")
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                );
            }
        }
    })

    
});



module.exports = router;

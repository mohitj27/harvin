var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    errors = require("../error"),
    pluralize = require("pluralize"),
    moment = require("moment-timezone"),
    async = require("async"),

    File = require("../models/File.js"),
    Topic = require("../models/Topic.js"),
    Chapter = require("../models/Chapter.js"),
    Subject = require("../models/Subject.js"),
    Class = require("../models/Class.js"),
    User = require("../models/User.js"),
    Batch = require("../models/Batch.js"),
    middleware = require("../middleware");

//file update helper
function fileUpdateSuccess(req, res, currentObject){
    req.flash("success", currentObject.fileName +" updated successfully");
    res.redirect("/db/collections");
}

//returns name of collections
router.get("/collections", middleware.isLoggedIn, middleware.isAdmin,  function(req, res, next){

    mongoose.connection.db.listCollections().toArray(function (err, names) {
        if (err) {
            console.log(err);
        } else {
            var namez = [];
            for(var i = 0; i < names.length; i++){
                if(names[i]["name"]=="system.indexes") continue;
                namez[i]=pluralize.singular(names[i]["name"]);
                
            }
            
            res.render("database", { names: namez});
        }
    });

});

//returns documents in particular collections
router.get("/collections/:collectionName", function(req, res, next){
    var collectionName = req.params.collectionName;
    switch(collectionName){
        case "file":    collections.file(req, res, next)
                    break;

        case "topic":   collections.topic(req, res, next)
                    break;

        case "chapter": collections.chapter(req, res, next)
                    break;

        case "subject": collections.subject(req, res, next)
                    break;

        case "class":   collections.class(req, res, next)
                    break;

        case "batch":   collections.batch(req, res, next)
                    break;

        case "user":    collections.user(req, res, next)
                    break;

        default: next(new errors.generic); 
    }
});

//returns json of particular document of particular collections
router.get("/collections/:collectionName/:documentId", function(req, res, next){
    var collectionName = req.params.collectionName;
    var documentId =  req.params.documentId;
    switch(collectionName){
        case "file":    collection.file(req, res, next)
                    break;

        case "topic":   collection.topic(req, res, next)
                    break;

        case "chapter": collection.chapter(req, res, next)
                    break;

        case "subject": collection.subject(req, res, next)
                    break;

        case "class":   collection.class(req, res, next)
                    break;

        case "batch":   collection.batch(req, res, next)
                    break;

        case "user":    collection.user(req, res, next)
                    break;

        default: next(new errors.generic); 
    }
})

//Editing particular document of particular collections
router.post("/collections/:collectionName/:documentId/edit", function(req, res, next){
    var currentObject = JSON.parse(req.body.object);
    var collectionName = req.body.collectionName;

    switch(collectionName){
        case "file":   update.file(req, res, next, currentObject) 
                    break;

        // case "topic":   
        //             break;

        // case "chapter": 
        //             break;

        // case "subject": 
        //             break;

        // case "class":  
        //             break;

        // case "batch":   
        //             break;

        // case "user":   
        //             break;

        default: next(new errors.generic); 
    }

});

router.put("/collections/:collectionName/:documentId", function(req, res, next){
    var currentObject = JSON.parse(req.body.currentObject);
    var newFile = {
        uploadDate:moment(Date.now()).tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm:ss a'),
        className : req.body.className,
        subjectName : req.body.subjectName,
        chapterName : req.body.chapterName,
        topicName : req.body.topicName
    }

    async.waterfall(
        [
            function(callback){
                File.findOneAndUpdate(
                    {_id:currentObject._id},
                    {
                        $set:{
                            className:newFile.className,
                            subjectName:newFile.subjectName,
                            chapterName:newFile.chapterName,
                            topicName:newFile.topicName,
                            uploadDate:newFile.uploadDate
                        },
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                    
                    function (err, updatedFile) {
                        if(!err && updatedFile){
                            callback(null, updatedFile)
                        }else{
                            console.log(err);
                            callback(err);
                        }
                    }
                );
            },
            function(updateFile, callback){
                Topic.findOneAndUpdate(
                    { topicName: currentObject.topicName},
                    {$pull:{files:currentObject._id}},
                    function(err, updatedTopic){
                        if(!err){
                            callback(null,updateFile ,updatedTopic)
                        }else{
                            console.log(err);
                            callback(err);
                        }
                    }
                );
            },
            function(updatedFile,updatedTopic, callback){
                Topic.findOneAndUpdate(
                    { topicName: newFile.topicName },
                    { $addToSet:{ files:updatedFile } , $set:{topicName:newFile.topicName}},
                    { upsert: true, new: true, setDefaultsOnInsert: true },
                    function (err, createdTopic) {
                        if(!err && createdTopic){
                            callback(null, createdTopic)
                        }else{
                            console.log(err);
                            callback(err);
                        }
                    }
                );
            },
            function (createdTopic, callback) {
                Chapter.findOneAndUpdate(
                   { chapterName: newFile.chapterName },
                   { $addToSet:{ topics:createdTopic } , $set:{chapterName:newFile.chapterName}},
                   { upsert: true, new: true, setDefaultsOnInsert: true },
                   function (err, createdChapter) {
                       if(!err && createdChapter){
                           callback(null, createdChapter)
                       }else{
                           console.log(err);
                           callback(err);
                       }
                   }
               );
            },
            function (createdChapter, callback) {
                Subject.findOneAndUpdate(
                  { subjectName: newFile.subjectName },
                  { $addToSet:{ chapters:createdChapter } , $set:{ subjectName:newFile.subjectName}},
                  { upsert: true, new: true, setDefaultsOnInsert: true },
                  function (err, createdSubject) {
                      if(!err && createdSubject){
                          callback(null, createdSubject)
                          
                      }else{
                          console.log(err);
                          callback(err);
                      }
                   }
               );
           },
           function (createdSubject, callback) {
               Class.findOneAndUpdate(
                   { className: newFile.className },
                   { $addToSet:{ subjects:createdSubject } , $set:{className:newFile.className}},
                   { upsert: true, new: true, setDefaultsOnInsert: true },
                   function (err, createdClass) {
                       if(!err && createdClass){
                           callback(null)
                           fileUpdateSuccess(req,res, currentObject);
                       }else{
                          console.log(err);
                          callback(err);
                      }
                   }
               );
           }
        ],
        function(err, result){
            if(err){
                console.log(err);
            }
        }
    );
});
   
router.delete("/collections/:collectionName/:documentId", function(req, res, next){
    // console.log(req.body.object);
    res.send("deleted")
    console.log("deleted")

    switch(collectionName){
        case "file":    
                    break;

        // case "topic":   
        //             break;

        // case "chapter": 
        //             break;

        // case "subject": 
        //             break;

        // case "class":  
        //             break;

        // case "batch":   
        //             break;

        // case "user":   
        //             break;

        default: next(new errors.generic); 
    }

});

//functions of collection- return particular documents in particular collection
var collection = {
    
        file:function(req,res,next){
            File.findById(req.params.documentId, function(err, foundFile){
                if(!err && foundFile){
                    res.json({ dbType:"file",object:foundFile});
                }
            })
        },
    
        topic:function(req,res,next){
            Topic.findById(req.params.documentId, function(err, foundTopic){
                if(!err && foundTopic){
                    res.json({ dbType:"topic",object:foundTopic});
                }
            });
        },

        chapter:function(req,res,next){
            Chapter.findById(req.params.documentId, function(err, foundChapter){
                if(!err && foundChapter){
                    res.json({ dbType:"chapter",object:foundChapter});
                }
            });
        },

        subject:function(req,res,next){
            Subject.findById(req.params.documentId, function(err, foundSubject){
                if(!err && foundSubject){
                    res.json({ dbType:"subject",object:foundSubject});
                }
            });
        },

        class:function(req,res,next){
            Class.findById(req.params.documentId, function(err, foundClasse){
                if(!err && foundClasse){
                    res.json({ dbType:"class",object:foundClasse});
                }
            });
        },

        user:function(req,res,next){
            User.findById(req.params.documentId, function(err, foundUser){
                if(!err && foundUser){
                    res.json({ dbType:"user",object:foundUser});
                }
            });
        },

        batch:function(req,res,next){
            Batch.findById(req.params.documentId, function(err, foundBatch){
                if(!err && foundBatch){
                    res.json({ dbType:"batch",object:foundBatch});
                }
            });
        }
};

//functions of collections- return list of documents in particular collection
var collections = {
    
        file:function(req,res,next){
            File.find({}, function(err, foundFiles){
                if(!err && foundFiles){
                    res.json({ dbType:"file",objects:foundFiles});
                }
            })
        },
    
        topic:function(req,res,next){
            Topic.find({}, function(err, foundTopics){
                if(!err && foundTopics){
                    res.json({ dbType:"topic",objects:foundTopics});
                }
            });
        },

        chapter:function(req,res,next){
            Chapter.find({}, function(err, foundChapters){
                if(!err && foundChapters){
                    res.json({ dbType:"chapter",objects:foundChapters});
                }
            });
        },

        subject:function(req,res,next){
            Subject.find({}, function(err, foundSubjects){
                if(!err && foundSubjects){
                    res.json({ dbType:"subject",objects:foundSubjects});
                }
            });
        },

        class:function(req,res,next){
            Class.find({}, function(err, foundClasses){
                if(!err && foundClasses){
                    res.json({ dbType:"class",objects:foundClasses});
                }
            });
        },

        user:function(req,res,next){
            User.find({}, function(err, foundUsers){
                if(!err && foundUsers){
                    res.json({ dbType:"user",objects:foundUsers});
                }
            });
        },

        batch:function(req,res,next){
            Batch.find({}, function(err, foundBatches){
                if(!err && foundBatches){
                    res.json({ dbType:"batch",objects:foundBatches});
                }
                
            });
        }
};

//update
var update = {
    
        file:function(req,res,next, currentObject){
            Class.find({}, function(err, classes){
                if(err) console.log(err);
            })
            .populate({
                path:"subjects",
                model:"Subject",
                populate:{
                    path:"chapters",
                    model:"Chapter",
                    populate:{
                        path:"topics",
                        model:"Topic",
                        populate:{
                                path:"files",
                                model:"File"
                        }
                    }
                }
            })
            .exec(function(err, classes){
                if(err){
                    console.log(err);
                    req.flash("error","Please try again");
                    res.redirect("/files/uploadFile");
                }
                else{
                    console.log(currentObject)
                    res.render('updateFile',{classes:classes, currentObject:currentObject});
                }
            });
        },
    
        topic:function(req,res,next){
            
        },

        chapter:function(req,res,next){
           
        },

        subject:function(req,res,next){
            
        },

        class:function(req,res,next){
            
        },

        user:function(req,res,next){
            
        },

        batch:function(req,res,next){
            
        }
};

module.exports = router;
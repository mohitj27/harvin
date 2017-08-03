var express = require("express"),
    router = express.Router(),
    mongoose = require("mongoose"),
    errors = require("../error"),
    pluralize = require("pluralize"),

    File = require("../models/File.js"),
    Topic = require("../models/Topic.js"),
    Chapter = require("../models/Chapter.js"),
    Subject = require("../models/Subject.js"),
    Class = require("../models/Class.js");
    User = require("../models/User.js");
    Batch = require("../models/Batch.js");

router.get("/collections", function(req, res, next){

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

router.get("/collections/:collectionName", function(req, res, next){
    var collectionName = req.params.collectionName;
    switch(collectionName){
        case "file":  collections.file(req, res, next)
                    break;

        case "topic":  collections.topic(req, res, next)
                    break;

        case "chapter":  collections.chapter(req, res, next)
                    break;

        case "subject":  collections.subject(req, res, next)
                    break;

        case "class":  collections.class(req, res, next)
                    break;

        case "batch":  collections.batch(req, res, next)
                    break;

        case "user":  collections.user(req, res, next)
                    break;

        default: next(new errors.generic); 
    }
});

router.get("/collections/:collectionName/:documentId", function(req, res, next){
    var collectionName = req.params.collectionName;
    var documentId =  req.params.documentId;
    switch(collectionName){
        case "file":  collection.file(req, res, next)
                    break;

        case "topic":  collection.topic(req, res, next)
                    break;

        case "chapter":  collection.chapter(req, res, next)
                    break;

        case "subject":  collection.subject(req, res, next)
                    break;

        case "class":  collection.class(req, res, next)
                    break;

        case "batch":  collection.batch(req, res, next)
                    break;

        case "user":  collection.user(req, res, next)
                    break;

        default: next(new errors.generic); 
    }
})


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

module.exports = router;
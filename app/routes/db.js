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

//functions of collections
var collections = {
    
        file:function(req,res,next){
            File.find({}, function(err, foundFiles){
                if(!err && foundFiles){
                    res.json({objects:foundFiles});
                }
            })
        },
    
        topic:function(req,res,next){
            Topic.find({}, function(err, foundTopics){
                if(!err && foundTopics){
                    res.json({objects:foundTopics});
                }
            });
        },

        chapter:function(req,res,next){
            Chapter.find({}, function(err, foundChapters){
                if(!err && foundChapters){
                    res.json({objects:foundChapters});
                }
            });
        },

        subject:function(req,res,next){
            Subject.find({}, function(err, foundSubjects){
                if(!err && foundSubjects){
                    res.json({objects:foundSubjects});
                }
            });
        },

        class:function(req,res,next){
            Class.find({}, function(err, foundClasses){
                if(!err && foundClasses){
                    res.json({objects:foundClasses});
                }
            });
        },

        user:function(req,res,next){
            User.find({}, function(err, foundUsers){
                if(!err && foundUsers){
                    res.json({objects:foundUsers});
                }
            });
        },

        batch:function(req,res,next){
            Batch.find({}, function(err, foundBatches){
                if(!err && foundBatches){
                    res.json({objects:foundBatches});
                }
            });
        }
};

module.exports = router;
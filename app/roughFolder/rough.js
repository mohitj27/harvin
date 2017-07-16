async.waterfall(
    [
        function(callback){
            File.create(newFile, function(err, createdFile){
                if(err){
                    console.log("\nerror while storing file in db-->\n");
                    console.log(err);
                    callback(err);
                }
                else{
                    console.log("\nFile created\n");
                    callback(null, createdFile);
                }
            });
        },
        function(createdFile, callback){
            Topic.findOne(
                    {
                        "topicName":topicName
                    },
                    function(err, foundTopic){
                        if(err) {
                            console.log("finding topic error-->/n")
                            console.log(err);
                            // fileUploadError(req,res)
                            callback(err);
                        }
                        else{
                            if(foundTopic != null){
                                //we found one topic 
                                //here createdFile, foundTopic
                                //37
                                async.waterfall(
                                    [
                                        function(callback){
                                            Topic.update({_id:foundTopic._id},{$addToSet:{files:createdFile}}, function(err){
                                                if(err) {
                                                    console.log("updating topic error-->/n")
                                                    console.log(err);
                                                    //fileUploadError(req,res)
                                                    callback(err);
                                                    
                                                }else{
                                                    
                                                    callback(null);
                                                    
                                                }
                                            });
                                        },
                                        function(callback){
                                            //here createdFile, foundTopic
                                            //find chapter
                                            Chapter.findOne(
                                                {
                                                    "chapterName":chapterName
                                                },
                                                function(err, foundChapter){
                                                    if(err) {
                                                        console.log("finding chapter error-->/n")
                                                        console.log(err);
                                                        //fileUploadError(req,res)
                                                        callback(err)
                                                        
                                                    }
                                                    else{
                                                        if(foundChapter != null){
                                                            //here createdFile, foundTopic
                                                            //we found one chapter
                                                            //60
                                                            async.waterfall(
                                                                [
                                                                    function(callback){
                                                                        Chapter.update({_id:foundChapter._id},{$addToSet:{topics:foundTopic}}, function(err){
                                                                            if(err) {
                                                                                console.log("updating chapter error-->/n")
                                                                                console.log(err);
                                                                                callback(err);
                                                                                // fileUploadError(req,res)
                                                                                
                                                                            }else{
                                                                                //here createdFile, foundTopic, foundChapter
                                                                                //find subject
                                                                                Subject.findOne(
                                                                                    {
                                                                                        "subjectName":subjectName
                                                                                    },
                                                                                    function(err, foundSubject){
                                                                                        if(err) {
                                                                                            console.log("finding subject error-->/n")
                                                                                            console.log(err);
                                                                                        //    fileUploadError(req,res)
                                                                                            callback(err);
                                                                                            
                                                                                        }
                                                                                        else{
                                                                                            if(foundSubject != null){
                                                                                                //here createdFile, foundTopic, foundChapter
                                                                                                //we found one subject 
                                                                                                //83
                                                                                                async.waterfall(
                                                                                                    [
                                                                                                        function(callback){
                                                                                                            Subject.update({_id:foundSubject._id},{$addToSet:{chapters:foundChapter}}, function(err){
                                                                                                                if(err) {
                                                                                                                    console.log("updating subject error-->/n")
                                                                                                                    console.log(err);
                                                                                                                    // fileUploadError(req,res)
                                                                                                                    callback(err);
                                                                                                                    
                                                                                                                }else{
                                                                                                                    //here createdFile, foundTopic, foundChapter, found subject
                                                                                                                    //todo
                                                                                                                    console.log("\ncreatedFile->\n"+createdFile+"\nfoundTopic->\n"+foundTopic+"\nfoundChapter->\n"+foundChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                                    fileUploadSuccess(req,res);
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    ],
                                                                                                    function(err, result){
                                                                                                        if(err){
                                                                                                            console.log(err);
                                                                                                            fileUploadError(req,res);
                                                                                                        }
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                            else{
                                                                                                //here createdFile, foundTopic, foundChapter
                                                                                                //not found any subject, create one
                                                                                                //todos create new subject 
                                                                                                //100
                                                                                                async.waterfall(
                                                                                                    [
                                                                                                        function(callback){
                                                                                                            Subject.create(
                                                                                                                {
                                                                                                                    "subjectName": subjectName
                                                                                                                },
                                                                                                                function(err, createdSubject){
                                                                                                                    if(err) {
                                                                                                                        console.log("creating subject error-->/n")
                                                                                                                        console.log(err);
                                                                                                                        //fileUploadError(req,res)
                                                                                                                        callback(err);
                                                                                                                        
                                                                                                                    }else{
                                                                                                                        callback(null, createdSubject);
                                                                                                                    }
                                                                                                                }
                                                                                                            );
                                                                                                        },
                                                                                                        function(createdSubject, callback){
                                                                                                            //here createdFile, foundTopic, foundChapter
                                                                                                            //subject created
                                                                                                            //now update subject
                                                                                                            Subject.update({_id:createdSubject._id},{$addToSet:{chapters:foundChapter}}, function(err){
                                                                                                                if(err) {
                                                                                                                    console.log("updating subject error-->/n")
                                                                                                                    console.log(err);
                                                                                                                    //fileUploadError(req,res)
                                                                                                                    callback(err);
                                                                                                                    
                                                                                                                }else{
                                                                                                                    //here createdFile, foundTopic, foundChapter, createdSubject
                                                                                                                    //todo
                                                                                                                    console.log("\ncreatedFile->\n"+createdFile+"\nfoundTopic->\n"+foundTopic+"\nfoundChapter->\n"+foundChapter+"\ncreatedSubject->\n"+createdSubject);
                                                                                                                    fileUploadSuccess(req,res);
                                                                                                                    
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    ],
                                                                                                    function(err, result){
                                                                                                        if(err){
                                                                                                            console.log(err);
                                                                                                            fileUploadError(req,res);
                                                                                                        }
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                );
                                                                            }
                                                                        });
                                                                    }
                                                                ],
                                                                function(err, result){
                                                                    if(err){
                                                                        console.log(err);
                                                                        fileUploadError(req,res);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                        else{
                                                            //here createdFile ,foundTopic, not foundChapter 
                                                            //not found any chapter, create one
                                                            //create new chapter 
                                                            //145
                                                            async.waterfall(
                                                                [
                                                                    function(callback){
                                                                        Chapter.create(
                                                                            {
                                                                                "chapterName": chapterName
                                                                            },
                                                                            function(err, createdChapter){
                                                                                if(err) {
                                                                                    console.log("creating chapter error-->/n")
                                                                                    console.log(err);
                                                                                    callback(err);
                                                                                }else{
                                                                                    callback(null, createdChapter);
                                                                                }
                                                                            }
                                                                        );
                                                                    },
                                                                    function(createdChapter, callback){
                                                                        //chapter created
                                                                        //now update chapter
                                                                        Chapter.update({_id:createdChapter._id},{$addToSet:{topics:foundTopic}}, function(err){
                                                                            if(err) {
                                                                                console.log("updating chapter error-->/n")
                                                                                console.log(err);
                                                                                // fileUploadError(req,res)
                                                                                callback(err);
                                                                                
                                                                            }else{
                                                                               
                                                                                callback(null, createdChapter);
                                                                            }
                                                                        });
                                                                    },
                                                                    function(createdChapter, callback){
                                                                        //here created file, foundTopic, createdChapter
                                                                        //find subject
                                                                        Subject.findOne(
                                                                            {
                                                                                "subjectName":subjectName
                                                                            },
                                                                            function(err, foundSubject){
                                                                                if(err) {
                                                                                    console.log("finding subject error-->/n")
                                                                                    console.log(err);
                                                                                    // fileUploadError(req,res)
                                                                                    callback(err);
                                                                                    
                                                                                }else{
                                                                                    if(foundSubject != null ){
                                                                                        //here createdFile, foundTopic, createdChapter,
                                                                                        //we found one subject
                                                                                        async.waterfall(
                                                                                            [
                                                                                                function(callback){
                                                                                                    Subject.update({_id:foundSubject._id},{$addToSet:{chapters:createdChapter}}, function(err){
                                                                                                        if(err) {
                                                                                                            console.log("updating subject error-->/n")
                                                                                                            console.log(err);
                                                                                                            // fileUploadError(req,res)
                                                                                                            callback(err);
                                                                                                            
                                                                                                        }else{
                                                                                                            //here createdFile, foundTopic, createdChapter, foundSubject
                                                                                                            //todo
                                                                                                            console.log("\ncreatedFile->\n"+createdFile+"\nfoundTopic->\n"+foundTopic+"\ncreatedChapter->\n"+createdChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                            fileUploadSuccess(req,res);
                                                                                                            
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            ],
                                                                                            function(err, result){
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    fileUploadError(req,res);
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                ],
                                                                function(err, result){
                                                                    if(err){
                                                                        console.log(err);
                                                                        fileUploadError(req,res);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    ], 
                                    function(err, result){
                                        if(err){
                                            console.log(err);
                                            fileUploadError(req,res);
                                        }
                                    }
                                );
                            }else{
                                //here createdFile, not foundTopic
                                //not found any topic, create one
                                //create new topic 
                                //252
                                async.waterfall(
                                    [
                                        function(callback){
                                            Topic.create(
                                                {
                                                    "topicName": topicName
                                                },
                                                function(err, createdTopic){
                                                    if(err) {
                                                        console.log("creating topic error-->/n")
                                                        console.log(err);
                                                        // fileUploadError(req,res)
                                                        callback(err);
                                                        
                                                    }else{
                                                        callback(null, createdTopic);
                                                    }
                                                }
                                            );
                                        },
                                        function(createdTopic, callback){
                                            //topic created
                                            //now update topic
                                            Topic.update({_id:createdTopic._id},{$addToSet:{files:createdFile}}, function(err){
                                                if(err) {
                                                    console.log("updating topic error-->/n")
                                                    console.log(err);
                                                    // fileUploadError(req,res)
                                                    callback(err);
                                                    
                                                }else{
                                                    
                                                    callback(null, createdTopic);
                                                }
                                            });
                                        },
                                        function(createdTopic, callback){
                                            //here created file, createdTopic
                                            //find chapter
                                            Chapter.findOne(
                                                {
                                                    "chapterName":chapterName
                                                },
                                                function(err, foundChapter){
                                                    if(err) {
                                                        console.log("finding chapter error-->/n")
                                                        console.log(err);
                                                        // fileUploadError(req,res)
                                                        callback(err);
                                                        
                                                    }else{
                                                        if(foundChapter != null ){
                                                            async.waterfall(
                                                                [
                                                                    function(callback){
                                                                        Chapter.update({_id:foundChapter._id},{$addToSet:{topics:createdTopic}}, function(err){
                                                                            if(err) {
                                                                                console.log("updating chapter error-->/n")
                                                                                console.log(err);
                                                                                // fileUploadError(req,res)
                                                                                callback(err);
                                                                                
                                                                            }else{
                                                                                callback(null);
                                                                            }
                                                                        });
                                                                    },
                                                                    function(callback){
                                                                        //here createdFile, createdTopic, foundChapter
                                                                        //find subject
                                                                        Subject.findOne(
                                                                            {
                                                                                "subjectName":subjectName
                                                                            },
                                                                            function(err, foundSubject){
                                                                                if(err) {
                                                                                    console.log("finding subject error-->/n")
                                                                                    console.log(err);
                                                                                    callback(err);
                                                                                }else{
                                                                                    if(foundSubject != null ){
                                                                                        //here createdFile, createdTopic, foundChapter
                                                                                        //we found one subject 
                                                                                        async.waterfall(
                                                                                            [
                                                                                                function(callback){
                                                                                                    Subject.update({_id:foundSubject._id},{$addToSet:{chapters:foundChapter}}, function(err){
                                                                                                        if(err) {
                                                                                                            console.log("updating subject error-->/n")
                                                                                                            console.log(err);
                                                                                                            // fileUploadError(req,res)
                                                                                                            callback(err);
                                                                                                            
                                                                                                        }else{
                                                                                                            //here createdFile, createdTopic, foundChapter, foundSubject
                                                                                                            //todo
                                                                                                            console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\nfoundChapter->\n"+foundChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                            fileUploadSuccess(req,res);
                                                                                                            
                                                                                                            
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            ],
                                                                                             function(err, result){
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    fileUploadError(req,res);
                                                                                                }
                                                                                            }
                                                                                    );
                                                                                    }else{
                                                                                        //here createdFile, createdTopic, foundChapter
                                                                                        //not found any subject, create one
                                                                                        //todos create new subject
                                                                                        //329
                                                                                        async.waterfall(
                                                                                            [
                                                                                                function(callback){
                                                                                                    Subject.create(
                                                                                                        {
                                                                                                            "subjectName": subjectName
                                                                                                        },
                                                                                                        function(err, createdSubject){
                                                                                                            if(err) {
                                                                                                                console.log("creating subject error-->/n")
                                                                                                                console.log(err);
                                                                                                                // fileUploadError(req,res)
                                                                                                                callback(err);
                                                                                                                
                                                                                                            }else{
                                                                                                                callback(null, createdSubject);
                                                                                                            }
                                                                                                    });
                                                                                                },
                                                                                                function(createdSubject, callback){
                                                                                                    //here createdFile, createdTopic, foundChapter
                                                                                                    //subject created
                                                                                                    //now update subject
                                                                                                    Subject.update({_id:createdSubject._id},{$addToSet:{chapters:foundChapter}}, function(err){
                                                                                                        if(err) {
                                                                                                            console.log("updating subject error-->/n")
                                                                                                            console.log(err);
                                                                                                            // fileUploadError(req,res)
                                                                                                            callback(err);
                                                                                                            
                                                                                                        }else{
                                                                                                            //here createdFile, createdTopic, foundChapter, createdSubject
                                                                                                            //todo
                                                                                                            console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\nfoundChapter->\n"+foundChapter+"\ncreatedSubject->\n"+createdSubject);
                                                                                                            fileUploadSuccess(req,res);
                                                                                                            
                                                                                                            
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            ],
                                                                                            function(err, result){
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    fileUploadError(req,res);
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                }
                                                                        });
                                                                    }
                                                                ],
                                                                function(err, result){
                                                                    if(err){
                                                                        console.log(err);
                                                                        fileUploadError(req,res);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                        else{
                                                            //here createdFile, createdTopic, not foundChapter
                                                            //not found any chapter, create one
                                                            //create new chapter 
                                                            //374
                                                            async.waterfall(
                                                                [
                                                                    function(callback){
                                                                        Chapter.create(
                                                                            {
                                                                                "chapterName": chapterName
                                                                            },
                                                                            function(err, createdChapter){
                                                                                if(err) {
                                                                                    console.log("creating chapter error-->/n")
                                                                                    console.log(err);
                                                                                    // fileUploadError(req,res)
                                                                                    callback(err);
                                                                                    
                                                                                }else{
                                                                                    callback(null, createdChapter);
                                                                                }
                                                                        });
                                                                    },
                                                                    function(createdChapter, callback){
                                                                        //here createdFile, createdTopic, createdChapter
                                                                        //chapter created
                                                                        //now update chapter
                                                                        Chapter.update({_id:createdChapter._id},{$addToSet:{topics:createdTopic}}, function(err){
                                                                            if(err) {
                                                                                console.log("updating chapter error-->/n")
                                                                                console.log(err);
                                                                                // fileUploadError(req,res)
                                                                                callback(err);
                                                                                
                                                                            }else{
                                                                                callback(null, createdChapter);
                                                                            }
                                                                        });
                                                                    },
                                                                    function(createdChapter, callback){
                                                                         Subject.findOne(
                                                                            {
                                                                                "subjectName":subjectName
                                                                            },
                                                                            function(err, foundSubject){
                                                                                if(err) {
                                                                                    console.log("finding subject error-->/n")
                                                                                    console.log(err);
                                                                                    fileUploadError(req,res)
                                                                                    
                                                                                }else{
                                                                                    if(foundSubject != null ){
                                                                                        //here createdFile, createdTopic, createdChapter
                                                                                        //we found one subject
                                                                                        async.waterfall(
                                                                                            [
                                                                                                function(callback){
                                                                                                    Subject.update({_id:foundSubject._id},{$addToSet:{chapters:createdChapter}}, function(err){
                                                                                                        if(err) {
                                                                                                            console.log("updating subject error-->/n")
                                                                                                            console.log(err);
                                                                                                            // fileUploadError(req,res)
                                                                                                            callback(err);
                                                                                                            
                                                                                                        }else{
                                                                                                            //here createdFile, createdTopic, createdChapter, foundSubject
                                                                                                            //todo
                                                                                                            console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\ncreatedChapter->\n"+createdChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                            fileUploadSuccess(req,res);
                                                                                                            
                                                                                                            
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            ],
                                                                                            function(err, result){
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    fileUploadError(req,res);
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    }else{
                                                                                        //here createdFile, createdTopic, createdChapter
                                                                                        //not found any subject, create one
                                                                                        //todos create new subject 
                                                                                        //431
                                                                                        async.waterfall(
                                                                                            [
                                                                                                function(callback){
                                                                                                    Subject.create(
                                                                                                        {
                                                                                                            "subjectName": subjectName
                                                                                                        },
                                                                                                        function(err, createdSubject){
                                                                                                            if(err) {
                                                                                                                console.log("creating subject error-->/n")
                                                                                                                console.log(err);
                                                                                                                // fileUploadError(req,res)
                                                                                                                callback(err);

                                                                                                            }else{
                                                                                                                callback(null, createdSubject);
                                                                                                            }
                                                                                                    });
                                                                                                },
                                                                                                function(createdSubject, callback){
                                                                                                    //here createdFile, createdTopic, createdChapter
                                                                                                    //subject created
                                                                                                    //now update subject
                                                                                                    Subject.update({_id:createdSubject._id},{$addToSet:{chapters:createdChapter}}, function(err){
                                                                                                        if(err) {
                                                                                                            console.log("updating subject error-->/n")
                                                                                                            console.log(err);
                                                                                                            // fileUploadError(req,res)
                                                                                                            callback(err);
                                                                                                            
                                                                                                        }else{
                                                                                                            //here createdFile, createdTopic, createdChapter, createdSubject
                                                                                                            //todo
                                                                                                            console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\ncreatedChapter->\n"+createdChapter+"\ncreatedSubject->\n"+createdSubject);
                                                                                                            fileUploadSuccess(req,res);
                                                                                                            
                                                                                                            
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            ],
                                                                                            function(err, result){
                                                                                                if(err){
                                                                                                    console.log(err);
                                                                                                    fileUploadError(req,res);
                                                                                                }
                                                                                            }
                                                                                        );
                                                                                    }
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                ],
                                                                function(err, result){
                                                                    if(err){
                                                                        console.log(err);
                                                                        fileUploadError(req,res);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    ], 
                                    function(err, result){
                                        if(err){
                                            console.log(err);
                                            fileUploadError(req,res);
                                        }
                                    }
                                );
                            }
                        }
                    }

            );
        }
    ],
    function(err, result){
        if(err){
            console.log(err);
            fileUploadError(req,res);
        }
    }
);
var File = require("./models/File.js");
var Topic = require("./models/Topic.js");
var Chapter = require("./models/Chapter.js");
var Subject = require("./models/Subject.js");

var async = require("async");

var fileData = [
    {
        fileName: 'file1.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file1.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter1',
        topicName: 'subject1chapter1topic1'
    },{
        fileName: 'file2.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file2.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter1',
        topicName: 'subject1chapter1topic1'
    },{
        fileName: 'file3.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file3.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter1',
        topicName: 'subject2chapter1topic1'
    },{
        fileName: 'file4.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file4.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter1',
        topicName: 'subject2chapter1topic1'
    },{
        fileName: 'file5.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file5.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter2',
        topicName: 'subject1chapter2topic1'
    },{
        fileName: 'file6.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file6.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter2',
        topicName: 'subject1chapter2topic1'
    },{
        fileName: 'file7.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file7.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter2',
        topicName: 'subject2chapter2topic1'
    },{
        fileName: 'file8.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file8.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter2',
        topicName: 'subject2chapter2topic1'
    },{
        fileName: 'file9.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file9.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter1',
        topicName: 'subject1chapter1topic2'
    },{
        fileName: 'file10.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file10.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter1',
        topicName: 'subject1chapter1topic2'
    },{
        fileName: 'file11.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file11.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter1',
        topicName: 'subject2chapter1topic2'
    },{
        fileName: 'file12.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file12.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter1',
        topicName: 'subject2chapter1topic2'
    },{
        fileName: 'file13.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file13.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter2',
        topicName: 'subject1chapter2topic2'
    },{
        fileName: 'file14.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file14.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject1',
        chapterName: 'subject1chapter2',
        topicName: 'subject1chapter2topic2'
    },{
        fileName: 'file15.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file15.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter2',
        topicName: 'subject2chapter2topic2'
    },{
        fileName: 'file16.pdf',
        fileType: '.pdf',
        filePath: 'uploads/file16.pdf',
        uploadDate: 'July 16th 2017, 8:46:31 pm',
        fileSize: 30,
        subjectName: 'subject2',
        chapterName: 'subject2chapter2',
        topicName: 'subject2chapter2topic2'
    }
]

// var topicData = [
//     {
//         topicName:"subject1chapter1topic1"
//     },{
//         topicName:"subject2chapter1topic1"
//     },{
//         topicName:"subject1chapter2topic1"
//     },{
//         topicName:"subject2chapter1topic1"
//     },{
//         topicName:"subject1chapter1topic2"
//     },{
//         topicName:"subject2chapter1topic2"
//     },{
//         topicName:"subject1chapter2topic2"
//     },{
//         topicName:"subject2chapter2topic2"
//     },
// ]

// var chapterData = [
//     {
//         chapterName:"subject1chapter1"
//     },{
//         chapterName:"subject2chapter1"
//     },{
//         chapterName:"subject1chapter2"
//     },{
//         chapterName:"subject2chapter2"
//     },
// ]

function seed(){
    console.log("seeding database with dummy data");

    async.waterfall(
        [
            function(callback){
                File.remove({}, function(err){
                    if(err){
                        console.log(err);
                        callback(err);
                    }
                    else{
                        console.log("Files removed");
                        callback(null);
                    }
                });
            },
            function(callback){
                Topic.remove({}, function(err){
                    if(err){
                        console.log(err);
                        callback(err);
                    }
                    else{
                        console.log("Topics removed");
                        callback(null);
                    }
                });
            },
            function(callback){
                Chapter.remove({}, function(err){
                    if(err){
                        console.log(err);
                        callback(err);
                    }
                    else{
                        console.log("Chapters removed");
                        callback(null);
                    }
                });
            },
            function(callback){
                Subject.remove({}, function(err){
                    if(err){
                        console.log(err);
                        callback(err);
                    }
                    else{
                        console.log("Subjects removed");
                        callback(null);
                    }
                });
            },
            function(callback){
                async.eachOfSeries(fileData, function(fileSeed, callback){
                    console.log("data used---")
                     async.waterfall(
                        [
                            function(callback){
                                File.create(fileSeed, function(err, createdFile){
                                    if(err){
                                        console.log("\nerror while storing file in db-->\n");
                                        console.log(err);
                                        callback(err);
                                    }
                                    else{
                                        // console.log("\nFile created\n");
                                        callback(null, createdFile);
                                    }
                                });
                            },
                            function(createdFile, callback){
                                Topic.findOne(
                                        {
                                            "topicName":fileSeed.topicName
                                        },
                                        function(err, foundTopic){
                                            if(err) {
                                                console.log("finding topic error-->/n")
                                                console.log(err);
                                                // //fileUploadError(req,res)
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
                                                                        ////fileUploadError(req,res)
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
                                                                        "chapterName":fileSeed.chapterName
                                                                    },
                                                                    function(err, foundChapter){
                                                                        if(err) {
                                                                            console.log("finding chapter error-->/n")
                                                                            console.log(err);
                                                                            ////fileUploadError(req,res)
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
                                                                                                    // //fileUploadError(req,res)
                                                                                                    
                                                                                                }else{
                                                                                                    //here createdFile, foundTopic, foundChapter
                                                                                                    //find subject
                                                                                                    Subject.findOne(
                                                                                                        {
                                                                                                            "subjectName":fileSeed.subjectName
                                                                                                        },
                                                                                                        function(err, foundSubject){
                                                                                                            if(err) {
                                                                                                                console.log("finding subject error-->/n")
                                                                                                                console.log(err);
                                                                                                            //    //fileUploadError(req,res)
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
                                                                                                                                        // //fileUploadError(req,res)
                                                                                                                                        callback(err);
                                                                                                                                        
                                                                                                                                    }else{
                                                                                                                                        //here createdFile, foundTopic, foundChapter, found subject
                                                                                                                                        //todo
                                                                                                                                        console.log("\ncreatedFile->\n"+createdFile+"\nfoundTopic->\n"+foundTopic+"\nfoundChapter->\n"+foundChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                                                        // fileUploadSuccess(req,res);
                                                                                                                                        callback(null);
                                                                                                                                        
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        function(err, result){
                                                                                                                            if(err){
                                                                                                                                console.log(err);
                                                                                                                                //fileUploadError(req,res);
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
                                                                                                                                        "subjectName": fileSeed.subjectName
                                                                                                                                    },
                                                                                                                                    function(err, createdSubject){
                                                                                                                                        if(err) {
                                                                                                                                            console.log("creating subject error-->/n")
                                                                                                                                            console.log(err);
                                                                                                                                            ////fileUploadError(req,res)
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
                                                                                                                                        ////fileUploadError(req,res)
                                                                                                                                        callback(err);
                                                                                                                                        
                                                                                                                                    }else{
                                                                                                                                        //here createdFile, foundTopic, foundChapter, createdSubject
                                                                                                                                        //todo
                                                                                                                                        console.log("\ncreatedFile->\n"+createdFile+"\nfoundTopic->\n"+foundTopic+"\nfoundChapter->\n"+foundChapter+"\ncreatedSubject->\n"+createdSubject);
                                                                                                                                        // fileUploadSuccess(req,res);
                                                                                                                                        callback(null);
                                                                                                                                        
                                                                                                                                        
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        function(err, result){
                                                                                                                            if(err){
                                                                                                                                console.log(err);
                                                                                                                                //fileUploadError(req,res);
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
                                                                                            //fileUploadError(req,res);
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
                                                                                                    "chapterName": fileSeed.chapterName
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
                                                                                                    // //fileUploadError(req,res)
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
                                                                                                    "subjectName":fileSeed.subjectName
                                                                                                },
                                                                                                function(err, foundSubject){
                                                                                                    if(err) {
                                                                                                        console.log("finding subject error-->/n")
                                                                                                        console.log(err);
                                                                                                        // //fileUploadError(req,res)
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
                                                                                                                                // //fileUploadError(req,res)
                                                                                                                                callback(err);
                                                                                                                                
                                                                                                                            }else{
                                                                                                                                //here createdFile, foundTopic, createdChapter, foundSubject
                                                                                                                                //todo
                                                                                                                                console.log("\ncreatedFile->\n"+createdFile+"\nfoundTopic->\n"+foundTopic+"\ncreatedChapter->\n"+createdChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                                                // fileUploadSuccess(req,res);
                                                                                                                                callback(null);
                                                                                                                                
                                                                                                                                
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                ],
                                                                                                                function(err, result){
                                                                                                                    if(err){
                                                                                                                        console.log(err);
                                                                                                                        //fileUploadError(req,res);
                                                                                                                    }
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                        else{
                                                                                                            //here createdFile, foundTopic, createdChapter
                                                                                                            //not found any subject, create one
                                                                                                            //todos create new subject 
                                                                                                            async.waterfall(
                                                                                                                [
                                                                                                                    function(callback){
                                                                                                                        Subject.create(
                                                                                                                            {
                                                                                                                                "subjectName": fileSeed.subjectName
                                                                                                                            },
                                                                                                                            function(err, createdSubject){
                                                                                                                                if(err) {
                                                                                                                                    console.log("creating subject error-->/n")
                                                                                                                                    console.log(err);
                                                                                                                                    // //fileUploadError(req,res)
                                                                                                                                    callback(err);
                                                                                                                                    
                                                                                                                                }else{
                                                                                                                                    callback(null, createdSubject);
                                                                                                                                }
                                                                                                                            }
                                                                                                                        );
                                                                                                                    },
                                                                                                                    function(createdSubject, callback){
                                                                                                                        //here createdFile, foundTopic, createdChapter
                                                                                                                        //subject created
                                                                                                                        //now update subject
                                                                                                                        Subject.update({_id:createdSubject._id},{$addToSet:{chapters:createdChapter}}, function(err){
                                                                                                                            if(err) {
                                                                                                                                console.log("updating subject error-->/n")
                                                                                                                                console.log(err);
                                                                                                                                // //fileUploadError(req,res)
                                                                                                                                callback(err);
                                                                                                                                
                                                                                                                            }else{
                                                                                                                                //here createdFile, foundTopic, createdChapter, createdSubject
                                                                                                                                //todo
                                                                                                                                console.log("\ncreatedFile->\n"+createdFile+"\nfoundTopic->\n"+foundTopic+"\ncreatedChapter->\n"+createdChapter+"\ncreatedSubject->\n"+createdSubject);
                                                                                                                                // fileUploadSuccess(req,res);
                                                                                                                                callback(null);
                                                                                                                                
                                                                                                                                
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                ],
                                                                                                                function(err, result){
                                                                                                                    if(err){
                                                                                                                        console.log(err);
                                                                                                                        //fileUploadError(req,res);
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
                                                                                            //fileUploadError(req,res);
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
                                                                //fileUploadError(req,res);
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
                                                                        "topicName": fileSeed.topicName
                                                                    },
                                                                    function(err, createdTopic){
                                                                        if(err) {
                                                                            console.log("creating topic error-->/n")
                                                                            console.log(err);
                                                                            // //fileUploadError(req,res)
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
                                                                        // //fileUploadError(req,res)
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
                                                                        "chapterName":fileSeed.chapterName
                                                                    },
                                                                    function(err, foundChapter){
                                                                        if(err) {
                                                                            console.log("finding chapter error-->/n")
                                                                            console.log(err);
                                                                            // //fileUploadError(req,res)
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
                                                                                                    // //fileUploadError(req,res)
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
                                                                                                    "subjectName":fileSeed.subjectName
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
                                                                                                                                // //fileUploadError(req,res)
                                                                                                                                callback(err);
                                                                                                                                
                                                                                                                            }else{
                                                                                                                                //here createdFile, createdTopic, foundChapter, foundSubject
                                                                                                                                //todo
                                                                                                                                console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\nfoundChapter->\n"+foundChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                                                // fileUploadSuccess(req,res);
                                                                                                                                callback(null);
                                                                                                                                
                                                                                                                                
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                ],
                                                                                                                function(err, result){
                                                                                                                    if(err){
                                                                                                                        console.log(err);
                                                                                                                        //fileUploadError(req,res);
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
                                                                                                                                "subjectName": fileSeed.subjectName
                                                                                                                            },
                                                                                                                            function(err, createdSubject){
                                                                                                                                if(err) {
                                                                                                                                    console.log("creating subject error-->/n")
                                                                                                                                    console.log(err);
                                                                                                                                    // //fileUploadError(req,res)
                                                                                                                                    callback(err);
                                                                                                                                    
                                                                                                                                }else{
                                                                                                                                    callback(null, createdSubject);
                                                                                                                                }
                                                                                                                        });
                                                                                                                    },
                                                                                                                    function(createdSubject, callback){
                                                                                                                        //here createdFile, createdTopic, createdSubject
                                                                                                                        //subject created
                                                                                                                        //now update subject
                                                                                                                        Subject.update({_id:createdSubject._id},{$addToSet:{chapters:foundChapter}}, function(err){
                                                                                                                            if(err) {
                                                                                                                                console.log("updating subject error-->/n")
                                                                                                                                console.log(err);
                                                                                                                                // //fileUploadError(req,res)
                                                                                                                                callback(err);
                                                                                                                                
                                                                                                                            }else{
                                                                                                                                //here createdFile, createdTopic, foundChapter, createdSubject
                                                                                                                                console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\nfoundChapter->\n"+foundChapter+"\ncreatedSubject->\n"+createdSubject);
                                                                                                                                //  fileUploadSuccess(req,res);
                                                                                                                                callback(null);
                                                                                                                                
                                                                                                                                
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                ],
                                                                                                                function(err, result){
                                                                                                                    if(err){
                                                                                                                        console.log(err);
                                                                                                                        //fileUploadError(req,res);
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
                                                                                            //fileUploadError(req,res);
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
                                                                                                    "chapterName": fileSeed.chapterName
                                                                                                },
                                                                                                function(err, createdChapter){
                                                                                                    if(err) {
                                                                                                        console.log("creating chapter error-->/n")
                                                                                                        console.log(err);
                                                                                                        // //fileUploadError(req,res)
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
                                                                                                    // //fileUploadError(req,res)
                                                                                                    callback(err);
                                                                                                    
                                                                                                }else{
                                                                                                    callback(null, createdChapter);
                                                                                                }
                                                                                            });
                                                                                        },
                                                                                        function(createdChapter, callback){
                                                                                            Subject.findOne(
                                                                                                {
                                                                                                    "subjectName":fileSeed.subjectName
                                                                                                },
                                                                                                function(err, foundSubject){
                                                                                                    if(err) {
                                                                                                        console.log("finding subject error-->/n")
                                                                                                        console.log(err);
                                                                                                        // //fileUploadError(req,res)
                                                                                                        callback(err);
                                                                                                        
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
                                                                                                                                // //fileUploadError(req,res)
                                                                                                                                callback(err);
                                                                                                                                
                                                                                                                            }else{
                                                                                                                                //here createdFile, createdTopic, createdChapter, foundSubject
                                                                                                                                //todo
                                                                                                                                console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\ncreatedChapter->\n"+createdChapter+"\nfoundSubject->\n"+foundSubject);
                                                                                                                                // fileUploadSuccess(req,res);
                                                                                                                                callback(null);
                                                                                                                                
                                                                                                                                
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                ],
                                                                                                                function(err, result){
                                                                                                                    if(err){
                                                                                                                        console.log(err);
                                                                                                                        //fileUploadError(req,res);
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
                                                                                                                                "subjectName": fileSeed.subjectName
                                                                                                                            },
                                                                                                                            function(err, createdSubject){
                                                                                                                                if(err) {
                                                                                                                                    console.log("creating subject error-->/n")
                                                                                                                                    console.log(err);
                                                                                                                                    // //fileUploadError(req,res)
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
                                                                                                                                // //fileUploadError(req,res)
                                                                                                                                callback(err);
                                                                                                                                
                                                                                                                            }else{
                                                                                                                                //here createdFile, createdTopic, createdChapter, createdSubject
                                                                                                                                //todo
                                                                                                                                console.log("\ncreatedFile->\n"+createdFile+"\ncreatedTopic->\n"+createdTopic+"\ncreatedChapter->\n"+createdChapter+"\ncreatedSubject->\n"+createdSubject);
                                                                                                                                // fileUploadSuccess(req,res);
                                                                                                                                callback(null);
                                                                                                                                
                                                                                                                                
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }
                                                                                                                ],
                                                                                                                function(err, result){
                                                                                                                    if(err){
                                                                                                                        console.log(err);
                                                                                                                        //fileUploadError(req,res);
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
                                                                                            //fileUploadError(req,res);
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
                                                                //fileUploadError(req,res);
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
                                //fileUploadError(req,res);
                            }
                        });

                        return callback();
                        
                },function(err){
                    if(err){
                        console.log(err);
                        //fileUploadError(req,res);
                    }
                });
            }
           
            
        ],
        function(err, result){
            if(err) console.log(err);
            
        }
    );

}

module.exports = seed;
var express = require("express"),
    router = express.Router();
    mongoose = require("mongoose")
    db = require("../db")
    errors = require("../error"),

router.get("/collections", function(req, res, next){

console.log(db)
    if(db){
        mongoose.connection.db.listCollections().toArray(function (err, names) {
            if (err) {
                console.log(err);
            } else {
                console.log(names);
                res.render("database", { names: names});
            }
        });
    }
    else{
        console.log(err);
        next(new errors.generic)      
    }
});

module.exports = router;
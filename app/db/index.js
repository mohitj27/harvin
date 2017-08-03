var mongoose  = require("mongoose");
var config = require('../config')();

var url = process.env.DATABASEURL 
|| 'mongodb://'+config.mongo.host+':'+config.mongo.port+'/harvin';

mongoose.connect(url,{ useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function (err) {
      if (err) {
        console.log(err);
      }

});

module.exports = db;
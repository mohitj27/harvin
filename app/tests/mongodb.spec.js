describe("MongoDB", function() {
	it("is there a server running", function(next) {
		// var MongoClient = require('mongodb').MongoClient;
		mongoose = require("mongoose");
		config = require('../config')();
		mongoose.connect('mongodb://'+config.mongo.host+':'+config.mongo.port+'/harvin',{ useMongoClient: true }, function(err, db) {
			expect(err).toBe(null);
			expect(db).toBeDefined();
			next();
		});
	});
});
describe("MongoDB", function() {
	it("is there a server running", function(next) {
		// var MongoClient = require('mongodb').MongoClient;
		mongoose = require("mongoose");
		mongoose.connect('mongodb://127.0.0.1:27017/innov8',{ useMongoClient: true }, function(err, db) {
			expect(err).toBe(null);
			expect(db).toBeDefined();
			next();
		});
	});
});
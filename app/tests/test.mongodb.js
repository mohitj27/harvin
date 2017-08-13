var expect = require('chai').expect;
process.env.LOAD_CONFIG = 'test';
mongoose = require("mongoose");
config = require('../config')(process.env.LOAD_CONFIG);
var url = process.env.DATABASEURL ||
	'mongodb://' + config.mongo.host + ':' + config.mongo.port + '/harvin';
describe("MongoDB", function () {
	it("is there a server running", function (next) {
		mongoose.connect(url, {
			useMongoClient: true
		}, function (err, db) {
			expect(err).to.equal(null);
			expect(db).to.not.to.be.an('undefined');
			next();
		});
	});
});

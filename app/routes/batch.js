var express = require("express"),
	async = require("async"),

	Batch = require("../models/Batch"),
	Subject = require("../models/Subject"),
	errors = require("../error"),
	middleware = require("../middleware"),

	router = express.Router();

router.get("/updateBatch", middleware.isLoggedIn, middleware.isAdmin, function (req, res, next) {
	Batch.find({}, function (err, foundBatches) {
		if (err) {
			console.log(err);
			next(new errors.notFound);
		} else {
			Subject.find({}, function (err, foundSubjects) {
				if (err) {
					console.log(err);
					next(new errors.notFound);
				} else {
					res.render("createBatch", {
						batches: foundBatches,
						subjects: foundSubjects
					});
				}
			});
		}
	});
});


router.post("/updateBatch", middleware.isLoggedIn, middleware.isAdmin, function (req, res, next) {
	var subjectId = req.body.subjectId;
	var batchName = req.body.batchName;
	console.log("subjectId", subjectId)

	async.waterfall(
		[
			function (callback) {
				Subject.find({
					_id:{$in:subjectId}
				}, function (err, foundSubjects) {
					if (!err && foundSubjects) {
						console.log("foundSubjects", foundSubjects)
						callback(null, foundSubjects);

					} else {
						console.log(err);
						callback(err);
					}
				});
			},

			function (foundSubjects, callback) {
				Batch.findOneAndUpdate({
						batchName: batchName
					}, {
						$set: {
							batchName: batchName,
							subjects: foundSubjects
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, createdBatch) {
						if (!err && createdBatch) {
							req.flash("success", "Batch updated successfully");
							res.redirect("/batches/updateBatch");
						}
					}
				);
			}
		],
		function (err, result) {
			if (err) {
				console.log(err);
				next(new errors.generic);
			}
		}
	);
});

//finding batch with given batchName and populating the subject field in it
router.get("/:batchName", function (req, res, next) {
	Batch.findOne({
			batchName: req.params.batchName
		}, function (err, foundBatch) {
			if (err) {
				console.log(err);
				next(new errors.generic);
			}
		})
		.populate({
			path: "subjects",
			model: "Subject"
		})
		.exec(function (err, batch) {
			if (err) {
				req.flash("error", "Couldn't find the chosen Batch");
				res.redirect("/batch");
			} else {
				res.json({
					batch: batch
				});
			}
		});
});

module.exports = router;


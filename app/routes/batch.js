var express = require("express"),
	async = require("async"),

	Batch = require("../models/Batch"),
	Subject = require("../models/Subject"),
	Center = require("../models/Center"),
	errors = require("../error"),
	middleware = require("../middleware"),

	router = express.Router();

router.get("/updateBatch", middleware.isLoggedIn, middleware.isCentreOrAdmin, function (req, res, next) {
	Subject.find({atCenter: req.user._id}, function (err, foundSubjects) {
				if (err) {
					console.log(err);
					next(new errors.generic());
				} else {
					res.render("createBatch", {
						subjects: foundSubjects
					});
				}
			});
});

router.post("/updateBatch", middleware.isLoggedIn, middleware.isCentreOrAdmin, function (req, res, next) {
	var subjectId = req.body.subjectId;
	var batchName = req.body.batchName;
	var batchDesc = req.body.batchDesc;

	async.waterfall(
		[
			function (callback) {
				Subject.find({
					_id:{$in:subjectId}
				}, function (err, foundSubjects) {
					if (!err && foundSubjects) {
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
							subjects: foundSubjects,
							batchDesc: batchDesc,
							atCenter: req.user._id
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					},
					function (err, createdBatch) {
						if (!err && createdBatch) {
							callback(null, createdBatch)
						}else{
							console.log('err', err);
							callback(err)
						}
					}
				);
			},
			function (createdBatch, callback) {
				Center.findOneAndUpdate(req.user.username, {
					$addToSet:{
						batches: createdBatch._id
					},
					$set: {
						centerName: req.user.username
					}
				}, {
					upsert: true,
					new: true,
					setDefaultsOnInsert: true
				}, function (err, updatedCenter) {
						if(!err && updatedCenter){
							callback(null)
							req.flash("success", "Batch updated successfully");
							res.redirect("/admin/batches/updateBatch");
						} else{
							console.log(err);
							callback(err);
						}
				})
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
	// console.log('route');
	Batch.findOne({
			batchName: req.params.batchName
		})
		.populate({
			path: "subjects",
			model: "Subject"
		})
		.exec(function (err, batch) {
			if (err) {
				req.flash("error", "Couldn't find the chosen Batch");
				res.redirect("/admin/batch");
			} else {
				// console.log('batch', batch);
				res.json({
					batch: batch
				});
			}
		});
});

// Providing list of batches
router.get('/', (req, res, next) => {
	if(req.user){
		Batch.find({atCenter: req.user._id}, (err, foundBatches) => {
			if(!err && foundBatches) {
				res.json({batches: foundBatches});
			}
		});
	} else {
		Batch.find({}, (err, foundBatches) => {
			if(!err && foundBatches) {
				res.json({batches: foundBatches});
			}
		});
	}

});

module.exports = router;

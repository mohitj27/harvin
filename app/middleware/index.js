var middleware = {
	isLoggedIn: function (req, res, next) {
		// if(req.isAuthenticated()){
		//     return next();
		// }
		// req.flash("error", "login please");
		// res.redirect("/admin/login");
		next();
	},
	isAdmin: function (req, res, next) {
		// if(req.user.isAdmin){
		//     return next();
		// }
		// req.flash("error", "You are not authorized. Please login into admin account before uploading the file.");
		// res.redirect("/admin/login");
		next();
	}


};

module.exports = middleware;

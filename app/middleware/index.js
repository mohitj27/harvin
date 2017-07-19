var middleware = {
    isLoggedIn:     function(req, res, next){
                    if(req.isAuthenticated()){
                        return next();
                    }
                    req.flash("error", "login please");
                    res.redirect("/admin/login");
    }
    

};

module.exports = middleware;
var middleware = {
    isStudentLoggedIn:     function(req, res, next){
                    if(req.isAuthenticated()){
                        return next();
                    }
                    res.json({"error":"You are not logged in"});
    }
    

};

module.exports = middleware;
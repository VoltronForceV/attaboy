var users = require("../models/user");

exports.new = function(req, res) {
    res.render('login/new');
};

exports.login = function(req, res) {
    var params = req.body;
    users.get({user_name: params.user }, function(e, user) {
	if(user != null) {
            req.session.user = user;
            res.render("index", {user: user});
        } else {
            res.render("login/new", {error: true});
        }


    });

}

exports.checkLogin = function(req, res, next) {
    if(req.path != "/" && req.path != "/login" && req.path.indexOf("/js/") != 0 && req.path.indexOf("/css/") != 0 && req.path.indexOf("/media/") != 0 && !req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

exports.logout = function(req, res) {
    delete req.session.user;
    delete res.locals.user;
    res.render("login/new");
}
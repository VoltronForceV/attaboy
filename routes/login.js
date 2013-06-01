exports.new = function(req, res) {
    res.render('login/new');
}

exports.login = function(req, res) {
    var params = req.body;
    req.session.user = params.user;
    res.render("index", {title: "Express", user: req.session.user })
}

exports.checkLogin = function(req, res, next) {
    if(req.path != "/" && req.path != "/login" && !req.session.user) {
        res.redirect("/");
    } else {
        next();
    }
}
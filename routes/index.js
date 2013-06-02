
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { user: req.session.user });
};

exports.profile = function(req, res){
    res.render('index', { user: req.session.user });
};

exports.request = function(req,res){
    var i;
   // console.log([req,'-----------------------',res]);

};


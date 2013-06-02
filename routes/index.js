
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.profile = function(req, res){
    res.render('index');
};

exports.dashboard = function(req, res) {
    res.render('dashboard')
}

exports.request = function(req,res){
    var i;
   // console.log([req,'-----------------------',res]);

};


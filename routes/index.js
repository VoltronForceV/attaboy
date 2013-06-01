
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.profile = function(req, res){
    res.render('index', { title: 'Express' });
};

exports.request = function(req,res){
    var i;
   // console.log([req,'-----------------------',res]);

};


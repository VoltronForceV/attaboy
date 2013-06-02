<<<<<<< HEAD
var respond = function(err, response){
    if(err!==undefined){
        res.send({
            status : 'failure',
            data   : response
        });
    }
    else{
        res.send({
            status : 'success',
            data   : response
        });
    }
},
    user_model=require('models/user');
=======
var user_model=require('../models/user');
>>>>>>> a0d479a510a20e9bda666d66865bb94433f0f6c0
var info = function(req,res){
    // req.session.user.user_id; //user id
    if(req.session.user!==undefined){
        user_model.get({user_name: req.session.user.user_id}, function(err, result){
	    respond(err,result);
	});
    }
    else{
	respond(true, "not logged in");
	//not logged in
    }
},
    update = function(req,res){

    };
module.exports={
    info   : info,
    update : update
};

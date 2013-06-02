var respond = function(err, res, response){
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
    user_model=require('../models/user');
var info = function(req,res){
    // req.session.user.user_id; //user id
    if(req.session.user!==undefined){
        user_model.get({user_name: req.session.user.user_id}, function(err, result){
	    respond(err,res,result);
	});
    }
    else{
	respond(true,res, "not logged in");
	//not logged in
    }
},
    update = function(req,res){
	var i;
	if(req.session.user!==undefined){
	    if(req.body!=undefined){
		var profile_update={
			user_name: req.session.user.user_id,
			location_id: undefined,
			user_name: undefined,
			user_email: undefined,
			join_date: undefined,
			login_date: undefined
		};
		for(i in req.body){
		    if(i!='user_id' && profile_update.hasOwnProperty(i)){
			profile_update[i]=req.body[i];
		    }
		}
		user_model.update(profile_update, function(err, result){
		    respond(err,res,result);
		});
	    }
	    else{
		//no data
		respond(true,res,'no data supplied');
	    }
	}
	else{
	    respond(true,res, "not logged in");
	    //not logged in
	}
    };
module.exports={
    info   : info,
    update : update
};

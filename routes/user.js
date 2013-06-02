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
    user_model=require('../models/user'),
    transaction_model=require('../models/transaction');
var info = function(req,res){
    //TODO filter and pass transactions
    var active_goals={},completed_goals={};
    if(req.params.id !==undefined){
        //load other user page
        user_model.get({user_id: req.params.id}, function(err, result){
            console.log(['zzzzzzzz',result]);
            if(err!==undefined){
                //get transactions
                if(result.user_id!==undefined){
                    transaction_model.get({user_id: result.user_id}, function(err, transactions){
                        //filter transactions
                        //load user page
                        res.render('profile/user', { user: result,active_goals: undefined,completed_goals: undefined });
                    });
                }
            }
            else{

                //TODO handle this error(no user found)
            }
	    });
    }
    else if(req.session.user!==undefined){
        //get transactions
        //load user page
        transaction_model.get({user_id: req.session.user}, function(err, transactions){
            if(err!==undefined){
                //filter transactions
                //load user page
                res.render('profile/user', { user: req.session.user,active_goals: undefined,completed_goals: undefined });
            }
        });
    }
    else{
        console.log('not logged in; TODO handle this');
        res.render('login/new', { user: req.session.user });
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

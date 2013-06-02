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
    transaction_model=require('../models/transaction'),
    goals=require('../models/goal'),
    async=require('async');
var info = function(req,res){
    //TODO filter and pass transactions
    console.log('getting info');
    var active_goals={},completed_goals={};
    if(req.params.id !==undefined){
        console.log('loading other user page');
        //load other user page
        user_model.get({user_id: req.params.id}, function(err, result){
            console.log(['results',result]);
            if(err!==undefined){
                console.log('got user data');
                //get transactions
                if(result.user_id!==undefined){
                    console.log('time');
                    transaction_model.get({user_id: result.user_id}, function(err, transactions){
                        console.log('got transactions');
                        //filter transactions
                        //load user page
                        res.render('user/profile', { user: result,active_goals: undefined,completed_goals: undefined });
                    });
                }
            }
            else{

                //TODO handle this error(no user found)
            }
	    });
    }
    else if(req.session.user!==undefined){
        console.log('loading user page');
        //get transactions
        //load user page
        transaction_model.get({user_id: req.session.user}, function(err, transactions){
            console.log('got user transactions');
            if(err!==undefined){
                //filter transactions
                //load user page
                console.log('rendertime');
                res.render('user/profile', { user: req.session.user,active_goals: undefined,completed_goals: undefined });
            }
        });
    }
    else{
        console.log('not logged in; TODO handle this');
        res.render('login/new', { user: req.session.user });
    }
},
    update = function(req,res){
        if(req.params.id !==undefined){
            //load other user page
            user_model.get({user_id: req.params.id}, function(err, result){
                if(err!==undefined){
                    res.render('login/new', { user: req.session.user });
                }
                else{
                    //TODO handle this error(no user found)
                }
	        });
        }
        else{
            console.log('not logged in; TODO handle this');
            res.render('login/new', { user: req.session.user });
        }
    },
    process_update = function(req,res){
	    var i;


	    if(req.session.user!==undefined){
        console.log('s');
	        if(req.body!=undefined){
                        console.log('s');
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


//TODO: vastly improve this logic's efficiency.
var verifications = function(req, res) {
    goals.find({user_id: req.session.user.user_id}, function(e, r) {
        var arr = [];
        async.forEach(r, function(item, callback) {
            transaction_model.find({goal_id: item.goal_id}, function(e, transactions){
                var j;
                async.forEach(transactions, function(trans, cb2) {
                    if(trans.action == "finish") {
                        var found = false;
                        for(j = 0;j < transactions.length;j++) {
                            if((transactions[j].action == "verify" || transactions[j].action == "deny") && transactions[j].user_id == trans.user_id && transactions[j].goal_id == trans.goal_id) {
                                found = true
                            }
                        }
                        if(!found) {
                            async.parallel([function(cb3) { user_model.get({user_id: trans.user_id}, function(e, u) {
                                trans.user = u
                                cb3();
                            }) },
                                function(cb3) {
                                    goals.get({ goal_id: trans.goal_id }, function(e, u) {
                                        trans.goal = u
                                        cb3();
                                    })
                                }], function() {
                                arr.push(trans)
                                cb2();
                            })

                        } else {
                            cb2();
                        }
                    } else {
                        cb2();
                    }
                }, function() {
                  callback();
                })
            })

        }, function() {
            res.render("user/verifications", {verifications: arr})
        })


    })

}

var verify = function(req, res) {
    transaction_model.get({ transaction_id: req.params.id }, function(e, d) {
        transaction_model.add({ user_id: d.user_id, goal_id: d.goal_id, action: req.params.operation, date: new Date() }, function() {
            res.redirect("/verifications")
        })
    })
}

module.exports={
    info   : info,
    update : update,
    process_update: process_update,
    verifications: verifications,
    verify: verify
};

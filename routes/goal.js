var respond = function(error, response){
    if(error!==undefined){
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

goal = require('../models/goal'),
boilerplate = require('../boilerplate');

var add = function(req, res)
{
    if(req.body!== undefined){
        //goal_id
        var i,error={},user_id = req.session.user.user_id,form_fields={
            parent_id: '',
            location_id: '',
            start_date: '',
            end_date: '',
            duration: '',
            goal_title: '',
            goal_text: '',
            reward: '',
            max_participants: '',
            verification_method: '',
            verification_users: '',
            visibility: ''
        };
console.log(req.body);

        for(i in form_fields){
            if(req.body[i]!== undefined && req.body[i] !== ''){
                form_fields[i]=req.body[i];
            }
            else{
                if(i == 'goal_title' || i == 'goal_text'){
                    error[i] = "This value is required.";
                }
                else{
                    //populate with defaults
                    switch(i){
                    case 'reward':
                        form_fields[i]="That warm fuzzy feeling <3";
                        break;
                    case 'verification_method':
                        form_fields[i]='creator';
                        break;
                    case 'verification_users':
                        form_fields[i]='1';
                        break;
                    case 'visibility':
                        form_fields[i]='public';
                        break;
                    }
                }
            }
        } //end post iteration

        if(req.xhr)
        {
            if(boilerplate.empty(error)){
                goal.add(form_fields, function(error,goal_id){
                    respond(error, goal_id);
                });
            }
            else{
                 respond(true, error);
            }
        }
        else
        {
            if(boilerplate.empty(error))
            {
                console.log(form_fields);
                goal.add(form_fields, function(error, goal_id)
                {
                    res.redirect("/rewards/new/"+goal_id);
//                    res.render("rewards/new", { user: req.session.user, goal_id: goal_id });
                });
            }
            else
            {
                res.render("goals/create", {error: error});
            }
        }
    }
},

get = function(req, res) {

},

index = function(req, res) {
        goal.list(20, function(err, data) {
            if(!err) {
                res.render("goals/index", { goals: data});
            }
        })
    };

module.exports= {
    add:add,
    get:get,
    index: index
};

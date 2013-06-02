var goal_model = require('../models/goal');
var add= function(req, res){
        if(req.body!== undefined){
            //goal_id
            var i,err={},user_id = session.username,form_fields={
                parent_id:undefined,
                location_id:undefined,
                date:undefined,
                duration:undefined,
                goal_title:undefined,
                goal_text:undefined,
                reward:undefined,
                max_participants:undefined,
                verification_method:undefined,
                verification_users:undefined,
                visibility:undefined
            },
                respond = function(err, response){
                    var status;
                    if(err!==undefined){
                        res.send({
                            status : 'failure',
                            data   : 'response'
                        });
                    }
                    else{
                        res.send({
                            status : 'success',
                            data   : 'response'
                        });
                    }
                };
            for(i in form_fields){
                if(req.body[i]!==undefined){
                    form_fields[i]=req.body[i];
                }
                else{
                    if(i==('goal_title'||'goal_text')){
                        err['missing'].push(i);
                    }
                    else{
                        //populate with defaults
                        switch(i){
                        case 'parent_id':
                            form_fields[i]=0;
                            break;
                        case 'location_id':
                            form_fields[i]=0;
                            break;
                        case 'date':
                            form_fields[i]=0;
                            break;
                        case 'duration':
                            form_fields[i]=0;
                            break;
                        case 'max_participants':
                            form_fields[i]=0;
                            break;
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

            if(err!==undefined){
                 respond(true,err);
            }
            else{
                goal_model.add(form_fields, function(err,goal_id){
                    respond(err,goal_id);
                });
            }
        }
    },
    get= function(parameter,callback){

    };
module.exports= {
    add:add,
    get:get
};

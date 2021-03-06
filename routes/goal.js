var respond = function (error, response) {
        if (error !== undefined) {
            res.send({
                status: 'failure',
                data: response
            });
        }
        else {
            res.send({
                status: 'success',
                data: response
            });
        }
    },

    goal = require('../models/goal'),
    transaction = require('../models/transaction'),
    boilerplate = require('../boilerplate'),
    user = require('../models/user'),
    SendGrid = require('sendgrid').SendGrid,
    config = require('../config');
var sendgrid = new SendGrid("abaldwin", config.sendgrid.secret);

var create = function(req, res) {
        goal.get({goal_id: req.params.id}, function (error, goal_data)
        {
            if(goal_data.start_time === undefined)
                goal_data.start_time = '';
            if(goal_data.end_time === undefined)
                goal_data.end_time = '';
                
            res.render('goals/create', {goal: goal_data});
        });
    },

    add = function (req, res) {
        if (req.body !== undefined) {
            //goal_id
            var i, error = {}, form_fields = {
                user_id: req.session.user.user_id,
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

            for (i in form_fields) {
                if (req.body[i] !== undefined && req.body[i] !== '') {
                    form_fields[i] = req.body[i];
                }
                else {
                    if (i == 'goal_title' || i == 'goal_text') {
                        error[i] = "This value is required.";
                    }
                    else {
                        //populate with defaults
                        switch (i) {
                            case 'reward':
                                form_fields[i] = '[]';
                                break;
                            case 'verification_method':
                                form_fields[i] = 'creator';
                                break;
                            case 'verification_users':
                                form_fields[i] = '1';
                                break;
                            case 'visibility':
                                form_fields[i] = 'public';
                                break;
                        }
                    }
                }
            } //end post iteration

            if (req.xhr) {
                if (boilerplate.empty(error)) {
                    goal.add(form_fields, function (error, goal_id) {
                        respond(error, goal_id);
                    });
                }
                else {
                    respond(true, error);
                }
            }
            else {
                if (boilerplate.empty(error)) {
                    if(req.body.edit == 'true')
                    {
                        form_fields.goal_id = req.params.id;
                        
                        goal.update(form_fields, function (error) {
                            res.redirect("/goal/" + req.params.id);
                        });
                    }
                    else
                    {
                        goal.add(form_fields, function (error, goal_id) {
                            res.redirect("/goal/" + goal_id + "/ante");
                        });
                    }
                }
                else {
                    res.render("goals/create", {error: error});
                }
            }
        }
    },

    ante = function (req, res) {
        goal.get({goal_id: req.params.id}, function (error, goal_data) {
            var params = req.body, error = {};

            if (params.reward == 'Custom' && params.reward_text == '')
                error['reward_text'] = "You must select or enter a custom reward";

            if (boilerplate.empty(error)) {
                if (params.reward != 'Custom')
                    params.reward_text = params.reward;

                var reward = JSON.parse(goal_data.reward);
                reward.push({
                    'user_id': req.session.user.user_id,
                    'text': params.reward_text,
                    'arrival': params.arrival});

                reward = JSON.stringify(reward);

                goal.update({
                    goal_id: req.params.id,
                    reward: reward,
                    verification_method: params.verification_method,
                    verification_users: params.verification_users}, function () {
                    var datetime = boilerplate.datetime(new Date());

                    transaction.add({user_id: req.session.user.user_id, goal_id: req.params.id, action: 'goal', result: '{}', date: datetime}, function () {
                        res.redirect("/goal/" + req.params.id);
                    });
                });
            }
            else {
                res.render("goals/ante", {error: error, goal_id: req.params.id, user: req.session.user, goal: goal_data});
            }
        });

    },
    get = function (req, res) {
        goal.get({goal_id: req.params.id}, function (err, data) {
            user.get({ user_id: data.user_id }, function (error, user) {
                data.user = user;
                data.current_participants = 0;
                transaction.find({goal_id: req.params.id, "action": "join" }, function (error, trans) {
                    transaction.find({goal_id: req.params.id, user_id: req.session.user.user_id, action: "finish"}, function (error, finished) {
                        data.current_participants = trans.length;
                        var signed_up = false;
                        var t;
                        for (t = 0; t < trans.length; t++) {
                            if (trans[t].user_id == req.session.user.user_id) {
                                signed_up = true;
                            }
                        }
                        res.render('goals/show', {goal: data, user: req.session.user, signed_up: signed_up, finished: finished.length > 0 });
                    })
                })
            })
        })

    },

    index = function (req, res) {
        goal.list(20, function (err, data) {
            if (!err) {
                res.render("goals/index", { goals: data});
            }
        })
    },

    edit = function(req, res)
    {
        goal.get({goal_id: req.params.id}, function (error, goal_data)
        {
            if(goal_data.start_time === undefined)
                goal_data.start_time = '';
            if(goal_data.end_time === undefined)
                goal_data.end_time = '';
                
            res.render('goals/create', {goal: goal_data, edit: true});
        });
    },

    cancel = function(req, res)
    {
        goal.delete({goal_id: req.params.id}, function (error)
        {
            res.redirect("/user/" + req.session.user.user_id);
        });
    };
    
var join = function (req, res) {
    transaction.add({user_id: req.session.user.user_id, goal_id: req.params.id, date: new Date(), action: "join"}, function (err, result) {
        goal.get({goal_id: req.params.id}, function (err, result) {
            user.get({user_id: result.user_id }, function (err, user_result) {
                sendgrid.send({
                    to: user_result.user_email,
                    from: "jaolen@gmail.com",
                    subject: "Someone has joined your goal!",
                    text: "Someone has joined your goal (" + result.goal_title + ")."
                }, function (success, message) {
                    if (!success) {
                        console.log(message);
                    }
                })
            })
        })
        res.redirect("/goal/" + req.params.id);
    });}
		   
var finish = function (req, res) {
    transaction.add({user_id: req.session.user.user_id, goal_id: req.params.id, date: new Date(), action: "finish"}, function (err, result) {
        goal.get({goal_id: req.params.id}, function (err, result) {
            user.get({user_id: result.user_id }, function (err, user_result) {
                user.get({user_id: req.session.user.user_id }, function (err, target_user) {
                    sendgrid.send({
                        to: user_result.user_email,
                        from: "jaolen@gmail.com",
                        subject: target_user.user_name + " has finished your goal!",
                        text: target_user.user_name + " has finished your goal (" + result.goal_title + ")."
                    }, function (success, message) {
                        if (!success) {
                            console.log(message);
                        }
                    })
                })
            })
        })
        res.redirect("/goal/" + req.params.id);
    })
}

module.exports = {
    create: create,
    add: add,
    ante: ante,
    get: get,
    index: index,
    edit: edit,
    cancel: cancel,
    join: join,
    finish: finish
};

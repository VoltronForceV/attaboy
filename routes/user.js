var respond = function (err, res, response) {
        if (err !== undefined) {
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
    user_model = require('../models/user'),
    transaction_model = require('../models/transaction'),
    goals = require('../models/goal'),
    async = require('async'),
    SendGrid = require('sendgrid').SendGrid,
    config = require('../config');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

connection.connect();

var sendgrid = new SendGrid("abaldwin", config.sendgrid.secret);

var info = function (req, res) {
        //TODO filter and pass transactions
        console.log('getting info');
        var active_goals = {}, completed_goals = {};
        if (req.params.id !== undefined) {
            console.log('loading other user page');
            //load other user page
            user_model.get({user_id: req.params.id}, function (err, result) {
                console.log(['results', result]);
                if (err !== undefined) {
                    console.log('got user data');
                    //get transactions
                    if (result.user_id !== undefined) {
                        console.log('time');
                        transaction_model.get({user_id: result.user_id}, function (err, transactions) {
                            console.log('got transactions');
                            //filter transactions
                            //load user page
                            connection.query("select goal_id, goal_title from `goals` where goal_id in (select t1.goal_id from transactions t1 where user_id = ? and action = 'join' and (select count(*) from transactions t2 where t1.user_id = t2.user_id and t1.goal_id = t2.goal_id and t2.action = 'verify') = 0)",
                                [result.user_id], function (error, active_goals) {
                                    console.log(error);
                                    console.log(active_goals)
                                    connection.query("select goal_id, goal_title from goals where goal_id in (select t1.goal_id from transactions t1 where user_id = ? and action = 'join' and (select count(*) from transactions t2 where t1.user_id = t2.user_id and t1.goal_id = t2.goal_id and t2.action = 'verify') > 0)",
                                        [result.user_id], function (error, completed_goals) {
                                            console.log(error)
                                            res.render('user/profile', { user: result, active_goals: active_goals, completed_goals: completed_goals });
                                        })
                                })

                        });
                    }
                }
                else {

                    //TODO handle this error(no user found)
                }
            });
        }
        else if (req.session.user !== undefined) {
            console.log('loading user page');
            //get transactions
            //load user page
            transaction_model.get({user_id: req.session.user}, function (err, transactions) {
                console.log('got user transactions');
                if (err !== undefined) {
                    //filter transactions
                    //load user page
                    console.log('rendertime');
                    connection.query("select goal_id, goal_title from `goals` where goal_id in (select t1.goal_id from transactions t1 where user_id = ? and action = 'join' and (select count(*) from transactions t2 where t1.user_id = t2.user_id and t1.goal_id = t2.goal_id and t2.action = 'verify') = 0)",
                        [req.session.user.user_id], function (error, active_goals) {
                            console.log(error);
                            console.log(active_goals)
                            connection.query("select goal_id, goal_title from goals where goal_id in (select t1.goal_id from transactions t1 where user_id = ? and action = 'join' and (select count(*) from transactions t2 where t1.user_id = t2.user_id and t1.goal_id = t2.goal_id and t2.action = 'verify') > 0)",
                                [req.session.user.user_id], function (error, completed_goals) {
                                    console.log(error)
                                    res.render('user/profile', { user: req.session.user, active_goals: active_goals, completed_goals: completed_goals });
                                })
                        })

                }
            });
        }
        else {
            console.log('not logged in; TODO handle this');
            res.render('login/new', { user: req.session.user });
        }
    },
    update = function (req, res) {
        if (req.params.id !== undefined) {
            //load other user page
            user_model.get({user_id: req.params.id}, function (err, result) {
                if (err !== undefined) {
                    res.render('login/new', { user: req.session.user });
                }
                else {
                    //TODO handle this error(no user found)
                }
            });
        }
        else {
            console.log('not logged in; TODO handle this');
            res.render('login/new', { user: req.session.user });
        }
    },
    process_update = function (req, res) {
        var i;


        if (req.session.user !== undefined) {
            console.log('s');
            if (req.body != undefined) {
                console.log('s');
                var profile_update = {
                    user_name: req.session.user.user_id,
                    location_id: undefined,
                    user_name: undefined,
                    user_email: undefined,
                    join_date: undefined,
                    login_date: undefined
                };
                for (i in req.body) {
                    if (i != 'user_id' && profile_update.hasOwnProperty(i)) {
                        profile_update[i] = req.body[i];
                    }
                }
                user_model.update(profile_update, function (err, result) {
                    respond(err, res, result);
                });
            }
            else {
                //no data
                respond(true, res, 'no data supplied');
            }
        }
        else {
            respond(true, res, "not logged in");
            //not logged in
        }

    };


//TODO: vastly improve this logic's efficiency.
var verifications = function (req, res) {
    goals.find({user_id: req.session.user.user_id}, function (e, r) {
        var arr = [];
        async.forEach(r, function (item, callback) {
            transaction_model.find({goal_id: item.goal_id}, function (e, transactions) {
                var j;
                async.forEach(transactions, function (trans, cb2) {
                    if (trans.action == "finish") {
                        var found = false;
                        for (j = 0; j < transactions.length; j++) {
                            if ((transactions[j].action == "verify" || transactions[j].action == "deny") && transactions[j].user_id == trans.user_id && transactions[j].goal_id == trans.goal_id) {
                                found = true
                            }
                        }
                        if (!found) {
                            async.parallel([function (cb3) {
                                user_model.get({user_id: trans.user_id}, function (e, u) {
                                    trans.user = u
                                    cb3();
                                })
                            },
                                function (cb3) {
                                    goals.get({ goal_id: trans.goal_id }, function (e, u) {
                                        trans.goal = u
                                        cb3();
                                    })
                                }], function () {
                                arr.push(trans)
                                cb2();
                            })

                        } else {
                            cb2();
                        }
                    } else {
                        cb2();
                    }
                }, function () {
                    callback();
                })
            })

        }, function () {
            res.render("user/verifications", {verifications: arr})
        })


    })

}

var verify = function (req, res) {
    transaction_model.get({ transaction_id: req.params.id }, function (e, d) {
        transaction_model.add({ user_id: d.user_id, goal_id: d.goal_id, action: req.params.operation, date: new Date() }, function () {
            goals.get({goal_id: d.goal_id}, function (err, result) {
                user_model.get({user_id: d.user_id}, function (error, user_result) {
                    sendgrid.send({
                        to: user_result.user_email,
                        from: "jaolen@gmail.com",
                        subject: "YOU'RE DONE!",
                        text: req.session.user.user_name + " has verified your goal (" + result.goal_title + ") is finished! Congratulations!"
                    }, function (success, message) {
                        if (!success) {
                            console.log(message);
                        }
                    })
                })
            })
            res.redirect("/verifications")
        })
    })
}

module.exports = {
    info: info,
    update: update,
    process_update: process_update,
    verifications: verifications,
    verify: verify
};

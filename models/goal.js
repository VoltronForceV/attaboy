var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

connection.connect();

var goal = (function () {
    function add(row, callback) {
        connection.query('Insert into `goals` set ?', row, function (error, result) {
            if (typeof callback === 'function') {
                callback(error, result.insertId);
            }
        });
    }

    function update(row, callback) {
        connection.query('Update `goals` set ? where goal_id = ' + row.goal_id, row, function (error, result) {
            if (typeof callback === 'function') {
                callback(error);
            }
        });
    }

    function get(row, callback) {
        connection.query('Select * from `goals` where ? limit 1', row, function (error, result) {
            if (typeof callback === 'function') {
                callback(error, result[0]);
            }
        });
    }

    function find(row, callback) {
        var i;
        var s = ""
        var vals = [];
        var first = true;
        for (i in row) {
            if (!first)
                s = s + " AND "
            first = false;
            s = s + i + " = ?"
            vals.push(row[i])
        }
        connection.query('Select * from `goals` where ' + s, vals, function (error, result) {
            if (typeof callback === 'function') {
                callback(error, result);
            }
        });
    }

    function list(limit, callback) {
        connection.query('Select * from `goals` order by `goal_id` desc limit ?', [limit], function (error, result) {
            if (typeof callback === 'function') {
                callback(error, result);
            }
        });
    }

    return {
        add: add,
        update: update,
        get: get,
        list: list,
        find: find
    };
})();

module.exports = goal;

// Here's a nice example of inserting goals with a callback to display the newly inserted ID
/*
 goal.add(
 {
 'goal_title': "Win the Hackathon",
 'goal_text': "This isn't sample data, it's a prophecy.",
 'max_participants': 5,
 'verification_method': '3rd Party',
 'verification_users': 3,
 'privacy_type': 'Public'
 }, function(goal_id) { console.log("Good job! You made a new goal with the ID of "+goal_id); });
 */

// Here's a super great example of updating goals!
// goal.update({goal_id: 1, goal_title: 'HELLO WORLD!'});


//goal.get({goal_id: 1}, function(result) { console.log(result); });
//goal.list(10, function(result) { console.log(result); });

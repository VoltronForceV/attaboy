var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

var goal = (function()
{
    function add(row, callback)
    {
        connection.connect();

        connection.query('Insert into `goals` set ?', row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result.insertId);
            }
        });

        connection.end();
    }

    function update(row, callback)
    {
        connection.connect();

        connection.query('Update `goals` set ? where goal_id = ' + row.goal_id, row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error);
            }
        });

        connection.end();
    }

    function get(goal_id, callback)
    {
        connection.connect();

        connection.query('Select * from `goals` where goal_id = ? limit 1', [goal_id], function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result[0]);
            }
        });
        
        connection.end();        
    }

    function list(limit, callback)
    {
        connection.connect();

        connection.query('Select * from `goals` order by `goal_id` desc limit ?', [limit], function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result);
            }
        });
        
        connection.end();
    }

    return {
        add: add,
        update: update,
        get: get,
        list: list
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

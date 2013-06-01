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

        // We have to save the dates and insert them manually because NOW() is magic
        var start_date = row.start_date;
        var end_date = row.end_date;

        delete row.start_date;
        delete row.end_date;

        connection.query('Insert into `goals` set  start_date = '+start_date+', end_date = '+end_date+', ?', row, function(err, result)
        {
            if (err) throw err;

            console.log('Inserted row #' + result.insertId);

            if(typeof callback === 'function') {
                callback(result.insertId);
            }
        });
        
        connection.end();
    }

    function update(row)
    {
        connection.connect();

        connection.query('Update `goals` set ? where goal_id = ' + row.goal_id, row, function(err, result)
        {
            if (err) throw err;
        });
        
        connection.end();
    }

    function get(goal_id, callback)
    {
        connection.connect();

        connection.query('Select * from `goals` where goal_id = ? limit 1', [goal_id], function(err, result)
        {
            if (err) throw err;
            callback(result[0]);
        });
        
        connection.end();        
    }

    function list(limit, callback)
    {
        connection.connect();

        connection.query('Select * from `goals` order by `goal_id` desc limit ?', [limit], function(err, result)
        {
            if (err) throw err;

            console.log(result);
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

// Here's a nice example of inserting goals with a callback to display the newly inserted ID
/*
goal.add(
{
    'start_date': 'NOW()',
    'end_date': 'DATE_ADD(NOW(), INTERVAL 2 HOUR)',
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

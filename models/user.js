var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

var user = (function()
{
    function add(row, callback)
    {
        connection.connect();

        connection.query('Insert into `users` set join_date = NOW(), ?', row, function(err, result)
        {
            if (err) throw err;

            if(typeof callback === 'function') {
                callback(result.insertId);
            }
        });
        
        connection.end();
    }

    function update(row)
    {
        connection.connect();

        connection.query('Update `users` set ? where user_id = ' + row.user_id, row, function(err, result)
        {
            if (err) throw err;
        });
        
        connection.end();
    }

    function get(row, callback)
    {
        connection.connect();

        connection.query('Select * from `users` where ? limit 1', row, function(err, result)
        {
            if (err) throw err;
            callback(result[0]);
        });
        
        connection.end();        
    }

    function list(limit, callback)
    {
        connection.connect();

        connection.query('Select * from `users` order by `user_id` desc limit ?', [limit], function(err, result)
        {
            if (err) throw err;
            callback(result);
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

module.exports = user;

//user.get({user_name: 'Alan'}, function(result) { console.log(result); });

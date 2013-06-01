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

        connection.query('Update `users` set ? where user_id = ' + row.user_id, row, function(err, result)
        {
            if (err) throw err;
        });
        
        connection.end();
    }

    function get(user_id, callback)
    {
        connection.connect();

        connection.query('Select * from `users` where user_id = ? limit 1', [user_id], function(err, result)
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

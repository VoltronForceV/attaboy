var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

connection.connect();

var user = (function()
{
    function add(row, callback)
    {
        connection.query('Insert into `users` set join_date = NOW(), ?', row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result.insertId);
            }
        });
    }

    function update(row, callback)
    {
        connection.query('Update `users` set ? where user_id = ' + row.user_id, row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error);
            }
        });
    }

    function get(row, callback)
    {
        connection.query('Select * from `users` where ? limit 1', row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result[0]);
            }
        });
    }

    function list(limit, callback)
    {
        connection.query('Select * from `users` order by `user_id` desc limit ?', [limit], function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result);
            }
        });
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

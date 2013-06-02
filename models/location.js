var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

connection.connect();

var location = (function()
{
    function add(row, callback)
    {
        connection.query('Insert into `locations` set join_date = NOW(), ?', row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result.insertId);
            }
        });
    }

    function update(row, callback)
    {
       connection.query('Update `locations` set ? where location_id = ' + row.location_id, row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error);
            }
        });
    }

    function get(row, callback)
    {
        connection.query('Select * from `locations` where ? limit 1', row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result[0]);
            }
        });
    }

    function list(limit, callback)
    {
        connection.query('Select * from `locations` order by `location_id` desc limit ?', [limit], function(error, result)
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

module.exports = location;

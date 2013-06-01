var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

var location = (function()
{
    function add(row, callback)
    {
        connection.connect();

        connection.query('Insert into `locations` set join_date = NOW(), ?', row, function(error, result)
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

        connection.query('Update `locations` set ? where location_id = ' + row.location_id, row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error);
            }
        });
        
        connection.end();
    }

    function get(location_id, callback)
    {
        connection.connect();

        connection.query('Select * from `locations` where location_id = ? limit 1', [location_id], function(error, result)
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

        connection.query('Select * from `locations` order by `location_id` desc limit ?', [limit], function(error, result)
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

module.exports = location;

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

        connection.query('Insert into `locations` set join_date = NOW(), ?', row, function(err, result)
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

        connection.query('Update `locations` set ? where location_id = ' + row.location_id, row, function(err, result)
        {
            if (err) throw err;
        });
        
        connection.end();
    }

    function get(location_id, callback)
    {
        connection.connect();

        connection.query('Select * from `locations` where location_id = ? limit 1', [location_id], function(err, result)
        {
            if (err) throw err;
            callback(result[0]);
        });
        
        connection.end();        
    }

    function list(limit, callback)
    {
        connection.connect();

        connection.query('Select * from `locations` order by `location_id` desc limit ?', [limit], function(err, result)
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

module.exports = location;

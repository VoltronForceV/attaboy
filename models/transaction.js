var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

var transaction = (function()
{
    function add(row, callback)
    {
        connection.connect();

        connection.query('Insert into `transactions` set ?', row, function(err, result)
        {
            if (err) throw err;

            if(typeof callback === 'function') {
                callback(result.insertId);
            }
        });
        
        connection.end();
    }

    return {
        add: add
    };
})();

module.exports = transaction;

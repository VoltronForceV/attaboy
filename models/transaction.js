var config = require('../config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : config.mysql.user,
    password : config.mysql.password,
    database : config.mysql.database
});

connection.connect();

var transaction = (function()
{
    function add(row, callback)
    {
        connection.query('Insert into `transactions` set ?', row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result.insertId);
            }
        });
    }

    return {
        add: add
    };
})();

module.exports = transaction;

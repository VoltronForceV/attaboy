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
    var add=function(row, callback){
        connection.query('Insert into `transactions` set ?', row, function(error, result)
        {
            if(typeof callback === 'function') {
                callback(error, result.insertId);
            }
        });
    },
        get=function(row,callback){
            console.log('get transaction data');
            connection.query('Select * from `users` where ? limit 1', row, function(error, result){
                console.log([error,result]);
                if(typeof callback === 'function') {
		            if(result!==undefined&&result.length>0){
		                callback(error, result[0]);
		            }
                }
            });
        };


    return {
        add: add,
        get: get
    };
})();

module.exports = transaction;

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
                   
		                callback(error, result[0]);

                }
            });
        },
        find=function(row, callback) {
            var i;
            var s = ""
            var vals = [];
            var first = true;
            for(i in row) {
                if(!first)
                    s = s + " AND "
                first = false;
                s = s + i + " = ?"
                vals.push(row[i])
            }
                        var f = connection.query('Select * from `transactions` where ' + s, vals, function(error, result){
                            if(typeof callback === 'function') {
            		            if(result!==undefined){
            		                callback(error, result);
            		            }
                            }
                        });
            console.log(f);
        };


    return {
        add: add,
        get: get,
        find: find
    };
})();

module.exports = transaction;

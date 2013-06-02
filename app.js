
/**
 * Module dependencies.
 */


var express = require('express'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    routes ={
	index : require('./routes/index'),
	user  : require('./routes/user'),
	login : require('./routes/login'),
	goal  : require('./routes/goal')
    },
    expressLayouts = require('express-ejs-layouts');
var app = express();

// all environments
app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session());
app.use(routes.login.checkLogin); // login filter, prevents unauthorized logins
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

	index : require('./routes/index'),
	user  : require('./routes/user'),
	login : require('./routes/login'),
	goal  : require('./routes/goal')

//get requests
app.get('/', routes.index.index);
app.get('/user',routes.user.info);
app.get('/user/edit',routes.user.update);
app.get('/user/:id',routes.user.info);
app.get('/goal',routes.goal.get);
app.get('/goal/:id',routes.goal.get);
app.get('/goal/:id/comment',routes.goal.get);
app.get('/goal/:id/ante',routes.goal.update);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

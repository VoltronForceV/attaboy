
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
    models = {
	goal        : require('./models/goal'),
	location    : require('./models/location'),
	user        : require('./models/user'),
	tag         : require('./models/tag'),
	transaction : require('./models/transaction')
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
app.use(express.cookieParser('your secret here'));
app.use(express.session());
//app.use(login.checkLogin);
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index.index);
app.get('/login', routes.login.new);
app.post('/login', routes.login.login);

app.get('/goals/new', function(req, res) {
    res.render('goals/new');
});

app.get('/goal/add', routes.goal.add);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

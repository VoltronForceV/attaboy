
/**
 * Module dependencies.
 */


var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    login = require('./routes/login'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    goal = require('./models/goal'),
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

app.get('/', routes.index);
app.get('/login', login.new);
app.post('/login', login.login);
app.get('/goals/new', function(req, res) {
    res.render('goals/new');
});

app.get('/goal/add', routes.goal.add);
app.post('/test', routes.request);
app.post('/get', routes.request);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

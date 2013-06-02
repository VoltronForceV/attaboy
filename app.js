
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








//get requests
app.get('/', routes.index.index);
app.get('/login', routes.login.new);
app.get('/logout', routes.login.logout);
app.get('/user',routes.user.info);
app.get('/user/edit',routes.user.update);
app.get('/user/:id',routes.user.info);
app.get('/goals',routes.goal.get);
app.get('/goals/new', function(req, res) {res.render('goals/new', { user: req.session.user });});
app.get('/goals/create', function(req, res) {res.render('goals/create', { user: req.session.user });});
app.get("/goals/:id", function(req, res) {res.render('goals/show', { user: req.session.user });});
app.get('/goal/:id/comment',routes.goal.get);
//app.get('/goal/:id/ante',routes.goal.update); //needs view added
app.get('/rewards/new/:goal_id', function(req, res) {res.render('rewards/new', { user: req.session.user, goal_id: req.params.goal_id });});
app.get("/search", function(req, res){res.render('search', {user: req.session.user});});


//post requests
app.post('/login', routes.login.login);
app.post('/goals/create', routes.goal.add);











http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

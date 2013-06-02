
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
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});
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
app.get('/user/:id',routes.user.info);
app.get('/user/edit', function(req, res){res.render('profile/update');});
app.get('/goals',routes.goal.index);
app.get('/goals/new', function(req, res) {res.render('goals/new');});
app.get('/goals/create', function(req, res) {res.render('goals/create');});
app.get("/goals/:id", routes.goal.get);
app.get('/goal/:id/comment',routes.goal.get);
app.get('/rewards/new/:goal_id', function(req, res) {res.render('rewards/new', { goal_id: req.params.goal_id });});
app.get("/search", function(req, res){res.render('search');});
app.get('/dashboard', routes.index.dashboard);

//post requests
app.post('/login', routes.login.login);
app.post('/goals/create', routes.goal.add);











http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

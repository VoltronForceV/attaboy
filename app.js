
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
        goal  : require('./models/goal')
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
app.get('/user/edit', function(req, res) { res.render('user/update'), { user: req.session.user } });
app.get('/user/:id',routes.user.info);
app.get('/goals',routes.goal.index);
app.get('/goal/new', function(req, res) {res.render('goals/new');});
app.get('/goal/create', function(req, res) {res.render('goals/create');});
app.get('/goal/:id/create', routes.goal.create);
app.get("/goal/:id", routes.goal.get);
app.get('/goal/:id/comment',routes.goal.get);
app.get('/goal/:id/ante', function(req, res) { models.goal.get({goal_id: req.params.id}, function (error, goal_data) { res.render('goals/ante', { goal_id: req.params.id, user: req.session.user, goal: goal_data }); }); });
app.get('/goal/:id/edit', routes.goal.edit);
app.get('/goal/:id/cancel', routes.goal.cancel);
app.get('/goal/:id/join', routes.goal.join);
app.get('/goal/:id/finish', routes.goal.finish);
app.get("/search", function(req, res){res.render('search');});
app.get('/dashboard', routes.index.dashboard);

app.get('/verifications', routes.user.verifications)
app.get('/verifications/:id/:operation(verify|deny)', routes.user.verify)

app.get('/auth',routes.login.auth);
app.get('/authcb',routes.login.authcb);


//post requests
app.post('/login', routes.login.login);

app.post('/goals/create', routes.goal.add);
app.post('/user/edit', routes.user.process_update);
app.post('/goal/create', routes.goal.add);
app.post('/goal/:id/ante', routes.goal.ante);
app.post('/goal/:id/edit', routes.goal.add);






http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

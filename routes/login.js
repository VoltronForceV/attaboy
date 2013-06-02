var users = require("../models/user");

exports.new = function(req, res) {
    res.render('login/new');
};

exports.login = function(req, res) {
    var params = req.body;
    users.get({user_name: params.user }, function(e, user) {
	if(user != null) {
            req.session.user = user;
            res.render("dashboard", {user: user});
        } else {
            res.render("login/new", {error: true});
        }


    });

}

exports.checkLogin = function(req, res, next) {
    if(req.path != "/auth" && req.path != "/authcb" && req.path != "/" && req.path != "/login" && req.path.indexOf("/js/") != 0 && req.path.indexOf("/css/") != 0 && req.path.indexOf("/media/") != 0 && !req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
};

exports.logout = function(req, res) {
    delete req.session.user;
    delete res.locals.user;
    res.render("login/new");
};

exports.auth = function(req,res){
    var googleapis = require('googleapis'),
        OAuth2Client = googleapis.OAuth2Client;
    var oauth2Client = new OAuth2Client('509218314760.apps.googleusercontent.com', 'H69oQg1TVTk9eQY2tVeYrrXh', 'http://hyper.wetfish.net:8082/authcb');

    if(req.query!==undefined){
        // generates a url that allows offline access and asks permissions
        // for Google+ scope.
        var url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.profile email'
        });
        res.redirect(url);
    }
};

exports.authcb = function(req,res){
    var request = require("request"),token_request,request_length;


    token_request='code='+req['query']['code']+
	    '&client_id=509218314760.apps.googleusercontent.com&client_secret=H69oQg1TVTk9eQY2tVeYrrXh'+
	    '&redirect_uri=http://hyper.wetfish.net:8082/authcb'+
	    '&grant_type=authorization_code';
    request_length = token_request.length;
    request({ method: 'POST',
	          headers: {'Content-length': request_length, 'Content-type':'application/x-www-form-urlencoded'},
	          uri:'https://accounts.google.com/o/oauth2/token',
	          body: token_request
	        },function (err, response, body) {
                var access_token,
                    expires_in,
                    id_token;

                console.log(['hi',JSON.parse(body)]);

                if(err==undefined && response.statusCode==200){
                    access_token=JSON.parse(response.body).access_token;
                    expires_in=JSON.parse(response.body).expires_in;
                    id_token=JSON.parse(response.body).id_token;
                    var token = 'OAuth '+access_token;
                    request({ method: 'GET',
                              headers:{'Content-length': 0,Authorization: token},
                              uri:'https://www.googleapis.com/oauth2/v2/userinfo'},function(err,body,deets){
                                  if(err == undefined && body.statusCode==200){
                                           deets=JSON.parse(deets);
                                      users.get({user_email:deets.email},function(err,result){
                                          if(err==undefined){
                                              if(result==undefined){
                                                  //new user


                                                  var user={
                                                      user_email:deets.email,
                                                      user_name:deets.name,
                                                      expiration: expires_in,
                                                      access_token: access_token,
                                                      id_token: id_token};
                                                  console.log(user);
                                                 users.add(user,function(err,result){
                                                      console.log([err,result]);
                                                     if(err==undefined){
                                                         req.session.user = user;
                                                         res.render("dashboard", {user: user});
                                                     }
                                                     else{

                                                     }

                                                 });



                                              }
                                              else{
                                                  console.log('signed in');
                                                  //sign in
                                                  req.session.user=result;
                                                  res.render("dashboard", {user: user});
                                              }






                                          }
                                          else{
                                              console.log('sssss');
                                          }
                                      });
                                  }
                                  else{
                                      //TODO handle error
                                  }
                              });
                }
                else{
                    console.log([response.statusCode,'sss']);
                }
	        });
};



var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');



var RedisStore = require('connect-redis')(session);
var mongoose = require('mongoose');

var app = express();


var routes       = require('./routes/index');
var users        = require('./routes/users');
var templates    = require('./routes/templates');
var source       = require('./routes/source');
var schema       = require('./routes/schema');
var Oauth        = require('./models/OauthModel');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({
  store: new RedisStore({
    host: "127.0.0.1",
    port: 6379,
    db: "0"
  }),
  resave:false,
  saveUninitialized:false,
  secret: 'keyboard cat'
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(Oauth);

app.use(function auth(req, res,next) {
  var auth = new Oauth;
  var user = req.session.user ||'';
  if(user){
    var userObj = JSON.parse(user);
    app.locals.user = userObj.data;
    var mail = userObj.data.mail;
    req.session.name = userObj.data.name;
    req.session.username = mail.split('@')[0];
    req.session.user_id = userObj.data.id
    next();
  }else{
    auth.checkUser(req,res,next);
  }
  //console.log(req.session)
  //next();
})


app.use('/', routes);
app.use('/users', users);
app.use('/template', templates);
app.use('/source', source);
app.use('/schema', schema);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

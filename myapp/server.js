var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var pierLog = require( './pierlog' );
var ejs = require('ejs');
var apiCall = require( './routes/api' );

console.log('website server start ====================');

// app.use(express.compress());
var compression = require('compression');
app.use(compression());
//router config
var routes = require('./routes/index'),
    userApi = require('./routes/user-api'),
    merchantApi = require( './routes/merchant-api' ),
    users = require('./routes/users'),
    merchants = require('./routes/merchants'),
    mobile = require( './routes/mobile' ),
    weixin = require( './routes/weixin');

app.use(session({
  secret: 'pier-web-site-20151211',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge:1000*60*60 }
}))

app.use('/', function(req, res, next){
  var merchantReg = /^\/merchants\//;
  var userReg = /^\/users\//;
  var mobileReg = /^\/mobile\//;
  var weixinReg = /^\/weixin\//;

  if( merchantReg.test(req.path) ){
    app.set('views', path.join(__dirname, 'pier_merchant'));
    app.set('view engine', 'ejs');
  }else if( userReg.test(req.path)){
    app.set('views', path.join(__dirname, 'pier_user'));
    app.set('view engine', 'ejs');
  }else if( mobileReg.test(req.path) ){
    app.set('views', path.join(__dirname, 'mobile_app'));
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
  }else if( weixinReg.test(req.path) ){
    app.set('views', path.join(__dirname, 'pier_wx'));
    app.set('view engine', 'ejs');
  }else{
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
  }
  next();
})

// app.use(express.static(path.join(__dirname, 'pier_web_cn')));
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/pierlogo60.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/mobile', mobile );
app.use('/weixin', weixin );
app.use('/users', users);
app.use('/merchants',merchants);
app.use( '/sdk/v1/users', apiCall );
app.use('/api/users/v1', userApi);
app.use('/api/merchant/v1', merchantApi );
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('The url path "' + req.path +'" '+'Not Found');
  err.status = 404;
  // err.message =  err.message;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    pierLog.error( err.message );
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
  pierLog.error( err.message );
  res.render('error', {
    message: err.message,
    error: {}
  });
});

pierLog.info( 'The server is starting' );

module.exports = app;

/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Load controllers.
 */

var homeController = require('./controllers/home');
var ownerController = require('./controllers/owner');
var worldsController = require('./controllers/worlds');
var playersController = require('./controllers/players');
var purchasesController = require('./controllers/purchases');
var usersController = require('./controllers/users');

/**
 * API keys + Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/owner_passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Mongoose configuration.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Express configuration.
 */

var hour = 3600000;
var day = (hour * 24);
var month = (day * 30);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(connectAssets({
  paths: ['public/css', 'public/js'],
  helperContext: app.locals
}));
app.use(express.compress());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals._csrf = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: month }));
app.use(function(req, res, next) {
  // Keep track of previous URL
  if (req.method !== 'GET') return next();
  var path = req.path.split('/')[1];
  if (/(auth|login|logout|signup)$/i.test(path)) return next();
  req.session.returnTo = req.path;
  next();
});
app.use(app.router);
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});
app.use(express.errorHandler());

/**
 * Application routes.
 */

app.get('/', homeController.index);

app.get('/worlds', passportConf.isAuthenticated, worldsController.index);
app.get('/players', passportConf.isAuthenticated, playersController.index);
app.get('/player/:email', passportConf.isAuthenticated, playersController.edit);
app.post('/player/:email', passportConf.isAuthenticated, playersController.save);
app.get('/users', passportConf.isAuthenticated, usersController.index);
app.get('/purchases', passportConf.isAuthenticated, purchasesController.index);

app.get('/signup', ownerController.getSignup);
app.post('/signup', ownerController.postSignup);
app.get('/login', ownerController.getLogin);
app.post('/login', ownerController.postLogin);
app.get('/logout', ownerController.logout);
app.get('/account', passportConf.isAuthenticated, ownerController.getAccount);
app.post('/account/password', passportConf.isAuthenticated, ownerController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, ownerController.postDeleteAccount);

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;

var passport = require('passport');
var Owner = require('../models/Owner');
var secrets = require('../config/secrets');

/**
 * GET /account/login
 * Login page.
 */

exports.getLogin = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('owner/login', {
    title: 'Login'
  });
};

/**
 * POST /account/login
 * Sign in using email and password.
 * @param email
 * @param password
 */

exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, owner, info) {
    if (err) return next(err);
    if (!owner) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }
    req.logIn(owner, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/account');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /account
 * Profile page.
 */

exports.getAccount = function(req, res) {
  res.render('owner/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/password
 * Update current password.
 * @param password
 */

exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  Owner.findById(req.user.id, function(err, owner) {
    if (err) return next(err);

    owner.password = req.body.password;

    owner.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /account/signup
 * Signup page.
 */

exports.getSignup = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('owner/signup', {
    title: 'Create Account',
    query: req.query
  });
};

/**
 * POST /account/signup
 * Create a new local account.
 * @param email
 * @param password
 */

exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  var owner = new Owner({
    email: req.body.email,
    password: req.body.password
  });

  owner.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        req.flash('errors', { msg: 'Owner with that email already exists, sign in here instead.' });
      }
      return res.redirect('/signin');
    }
    req.logIn(owner, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });
};

/**
 * POST /account/delete
 * Delete owner account.
 * @param id - Owner ObjectId
 */

exports.postDeleteAccount = function(req, res, next) {
  Owner.remove({ _id: req.user.id }, function(err) {
    if (err) return next(err);
    req.logout();
    res.redirect('/');
  });
};

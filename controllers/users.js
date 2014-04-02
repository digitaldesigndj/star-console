var User = require('../models/User');
var secrets = require('../config/secrets');

/**
 * GET /users
 * Users page.
 */

exports.index = function(req, res) {
  User.find( function (err, users) {
    res.render('users', {
      title: 'Users',
      users: users
    });
  });
};

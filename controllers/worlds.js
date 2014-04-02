var World = require('../models/World');
var secrets = require('../config/secrets');

/**
 * GET /worlds
 * Worlds page.
 */

exports.index = function(req, res) {
  World.find( function (err, worlds) {
    res.render('worlds', {
      title: 'Worlds',
      worlds: worlds
    });
  });
};

var Player = require('../models/Player');
var secrets = require('../config/secrets');

/**
 * GET /players
 * Players page.
 */

exports.index = function(req, res) {
  Player.find( function (err, players) {
    res.render('players', {
      title: 'Players',
      players: players
    });
  });
};

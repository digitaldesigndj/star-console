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

exports.edit = function(req, res) {
  console.log(req.params.email)
  Player.findOne({'email':req.params.email}, function (err, player) {
    res.render('player', {
      title: 'Edit Player',
      player: player,
      email: req.params.email
    });
  });
};

exports.save = function(req, res, next) {
  Player.findOne({'email':req.params.email}, function (err, player) {
    if (err) return next(err);
    // player.email = req.body.email || '';
    player.alltime_votes = req.body.alltime_votes || '';
    player.alt_characters = req.body.alt_characters || '';
    player.city = req.body.city || '';
    player.country = req.body.country || '';
    player.forum = req.body.forum || '';
    player.forum_posts = req.body.forum_posts || '';
    player.forum_rep = req.body.forum_rep || '';
    player.gender = req.body.gender || '';
    player.hostname = req.body.hostname || '';
    player.ip = req.body.ip || '';
    player.loc = req.body.loc || '';
    player.location = req.body.location || '';
    player.name = req.body.name || '';
    player.picture = req.body.picture || '';
    player.player = req.body.player || '';
    player.postal = req.body.postal || '';
    player.rank = req.body.rank || '';
    player.region = req.body.region || '';
    player.server_tokens = req.body.server_tokens || '';
    player.starbound_password = req.body.starbound_password || '';
    player.system = req.body.system || '';
    // if( player.system !== '' ) {
    //   // player.system.worlds = req.body.system.worlds || '';
    //   player.system.size = req.body.system.size || '';
    //   player.system.planet = req.body.system.planet || '';
    //   player.system.z = req.body.system.z || '';
    //   player.system.y = req.body.system.y || '';
    //   player.system.x = req.body.system.x || '';
    //   player.system.sector = req.body.system.sector || '';
    // }
    player.system_coords = req.body.system_coords || '';
    player.thismonth_votes = req.body.thismonth_votes || '';
    player.website = req.body.website || '';
    player.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Player information updated.' });
      res.redirect('/players');
    });
  });
};
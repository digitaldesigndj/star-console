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
    player.profile.alltime_votes = req.body.alltime_votes || '';
    player.profile.alt_characters = req.body.alt_characters || '';
    player.profile.city = req.body.city || '';
    player.profile.country = req.body.country || '';
    player.profile.forum = req.body.forum || '';
    player.profile.forum_posts = req.body.forum_posts || '';
    player.profile.forum_rep = req.body.forum_rep || '';
    player.profile.gender = req.body.gender || '';
    player.profile.hostname = req.body.hostname || '';
    player.profile.ip = req.body.ip || '';
    player.profile.loc = req.body.loc || '';
    player.profile.location = req.body.location || '';
    player.profile.name = req.body.name || '';
    player.profile.picture = req.body.picture || '';
    player.profile.player = req.body.player || '';
    player.profile.postal = req.body.postal || '';
    player.profile.rank = req.body.rank || '';
    player.profile.region = req.body.region || '';
    player.profile.server_tokens = req.body.server_tokens || '';
    player.profile.starbound_password = req.body.starbound_password || '';
    player.profile.system = req.body.system || '';
    // if( player.profile.system !== '' ) {
    //   // player.profile.system.worlds = req.body.system.worlds || '';
    //   player.profile.system.size = req.body.system.size || '';
    //   player.profile.system.planet = req.body.system.planet || '';
    //   player.profile.system.z = req.body.system.z || '';
    //   player.profile.system.y = req.body.system.y || '';
    //   player.profile.system.x = req.body.system.x || '';
    //   player.profile.system.sector = req.body.system.sector || '';
    // }
    player.profile.system_coords = req.body.system_coords || '';
    player.profile.thismonth_votes = req.body.thismonth_votes || '';
    player.profile.website = req.body.website || '';
    player.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Player information updated.' });
      res.redirect('/players');
    });
  });
};
var Purchase = require('../models/Purchase');
var secrets = require('../config/secrets');

/**
 * GET /purchases
 * Purchases page.
 */

exports.index = function(req, res) {
  Purchase.find( function (err, purchases) {
    res.render('purchases', {
      title: 'Purchases',
      purchases: purchases
    });
  });
};

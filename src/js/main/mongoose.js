(function () {
  'use strict';
  var mongoose      = require('mongoose');
  var User          = require('../models/User');
  var domainModel   = require('../models/Domain');
  var holdingModel  = require('../models/Holding');
  var provinceModel = require('../models/Province');

  module.exports = function (conf, logger) {
    mongoose.connect(conf.conString);
    var db = mongoose.connection;
    db.on('error', logger.error.bind('DB connection error ...'));
    db.once('open', function callback() {
      logger.debug('Lindoria db opened.');
    });

    User.createDefaultUsers();
    domainModel.createDefaultDomains();
    provinceModel.createDefaultProvinces();
    holdingModel.createDefaultHoldings();

  };

}());
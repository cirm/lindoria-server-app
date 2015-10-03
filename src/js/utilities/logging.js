(function () {
  'use strict';

  var logger = require('../utilities/winston');

  module.exports = {
    logErr: function (err) {
      logger.error(err);
      //res.status(400).send({reason : err.toString()});
    },
    resErr: function (err, res) {
      logger.error(err.toString());
      res.status(400).send({reason: err.toString()});
    },
    debug: function (msg) {
      logger.debug(msg);
    },
    info: function (msg) {
      logger.info(msg);
    }
  };
  
}());
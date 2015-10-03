(function () {

  'use strict';

  var winston = require('winston')
    , moment  = require('moment');

  winston.emitErrs = true;

  var logger = new winston.Logger({
    transports : [
      new winston.transports.Console({
        level          : 'debug',
        handleExeptions: true,
        json           : false,
        colorize       : true,
        timestamp      : function () {
          return moment().format('D MMM HH:mm:ss');
        }
      })
    ],
    exitOnError: false
  });
  module.exports = logger;
  module.exports.stream = {
    write: function (message) {
      logger.info(message.slice(0, -1));
    }
  };

}());
(function () {
  'use strict';

  var express = require('express');
  var logger  = require('./utilities/winston');


  var app = express();

  var config = require('./config/conf');
  logger.debug('Loading config for ' + config.envString + ' env.');

  require('./postgres/provision');

  require('./main/express')(app, config, logger);
  require('./routes/authRoutes')(app);
  require('./routes/birthrightRoutes')(app);
  require('./routes/indexRoutes')(app);

  app.listen(config.port);
  logger.debug('Lindoria app listening on port: ' + config.port + ' ...');
}());
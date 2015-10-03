(function () {
  'use strict';

  var express = require('express')
    , logger  = require('./app/utilities/winston');


  var app = express();

  var config = require('./app/config/conf');
  logger.debug('Loading config for ' + config.envString + ' env.');

  //require('./app/main/mongoose')(config, logger);
  require('./app/main/provisionDb')();
  require('./app/main/express')(app, config, logger);
  require('./app/routes/authRoutes')(app);
  require('./app/routes/indexRoutes')(app);

  app.listen(config.port);
  logger.debug('Lindoria app listening on port: ' + config.port + ' ...');

}());
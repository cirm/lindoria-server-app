//app/config/express.js
(function () {
  'use strict';

  var morgan     = require('morgan');
  var express    = require('express');
  var bodyParser = require('body-parser');
  var expressJwt = require('express-jwt');

  module.exports = function (app, config, logger) {

    app.set('views', config.rootPath + 'views');
    app.set('view engine', 'jade');

    logger.debug('Overriding "Express" logger with "winston".');
    app.use(morgan(config.logFormat, {
      stream: logger.stream
    }));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());


    app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type, Authorization');
      next();
    });

    app.use(express.static(config.rootPath + '/public'));

    //app.get('/partials/*', function (req, res) {
    //  res.render('../../public/src/js/' + req.params[0]);
    //});

    app.use('/api', expressJwt({
        secret      : config.tokenSecret,
        userProperty: 'Authorization',
        algorithms  : config.tokenOptions.algorithm
      })
    );

    app.use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send('Invalid token...' + err.toString());
      } else {
        next();
      }
    });
  };

}());

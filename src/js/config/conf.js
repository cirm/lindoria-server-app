(function () {
  'use strict';

  var path     = require('path')
    , fs       = require('fs')
    , rootPath = path.normalize(__dirname + '/../')
    , env      = process.env.NODE_ENV || 'development';

  var config = {
    development: {
      rootPath    : rootPath,
      envString   : 'development',
      port        : 8080,
      logFormat   : 'dev',
      conString   : 'mongodb://localhost:27017/lindoria',
      pgPass      : 'ToomasOnHeaDm123',
      pgUser      : 'geego.moonshine',
      pgConnString: 'postgres://geegomoonshine:ToomasOnHeaDm123@localhost:5432/lindoriadb',
      tokenSecret : fs.readFileSync(rootPath + 'ssl/pub_lind_token.pem'),
      tokenOptions: {
        algorithm       : 'HS256',
        expiresIn: 3600
      }
    },
    staging    : {
      rootPath    : rootPath,
      port        : 8080,
      envString   : 'staging',
      logFormat   : 'dev',
      conString   : 'mongodb://db:27017/lindoria',
      pgConnString: 'postgres://geegomoonshine:ToomasOnHeaDm123@db:5432/lindoriadb',
      tokenSecret : fs.readFileSync(rootPath + 'ssl/pub_lind_token.pem'),
      tokenOptions: {
        algorithm       : 'HS256',
        expiresIn: 3600
      }
    }

  };

  module.exports = config[env];

}());
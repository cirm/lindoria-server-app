(function () {
  'use strict';

  var path     = require('path');
  var fs       = require('fs');
  var rootPath = path.normalize(__dirname + '/../');
  var env      = process.env.NODE_ENV || 'development';

  var config = {
    development: {
      rootPath    : rootPath,
      envString   : 'development',
      port        : 8080,
      logFormat   : 'dev',
      tokenSecret : fs.readFileSync(rootPath + 'ssl/pub_lind_token.pem'),
      tokenOptions: {
        algorithm: 'HS256',
        expiresIn: 3600
      },
      db          : {
        pgUser  : 'geegomoonshine',
        pgPass  : 'ToomasOnHeaDm123',
        port    : 5432,
        host    : 'localhost',
        database: 'lindoriadb'
      }
    },
    staging    : {
      rootPath    : rootPath,
      port        : 8080,
      envString   : 'staging',
      logFormat   : 'dev',
      tokenSecret : fs.readFileSync(rootPath + 'ssl/pub_lind_token.pem'),
      tokenOptions: {
        algorithm: 'HS256',
        expiresIn: 3600
      },
      db          : {
        pgUser  : 'geegomoonshine',
        pgPass  : 'ToomasOnHeaDm123',
        port    : 5432,
        host    : 'db',
        database: 'lindoriadb'
      }
    }

  };

  module.exports = config[env];

}());
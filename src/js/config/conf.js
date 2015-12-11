(function () {
  'use strict';

  var path     = require('path');
  var fs       = require('fs');
  var rootPath = path.normalize(__dirname + '/../');
  var env      = process.env.NODE_ENV || 'development';

  var config = {
    development: {
      rootPath:     rootPath,
      envString:    'development',
      port:         8080,
      logFormat:    'dev',
      tokenSecret:  fs.readFileSync(rootPath + 'ssl/pub_lind_token.pem'),
      tokenOptions: {
        algorithm: 'HS256',
        expiresIn: 3600
      },
      db:           {
        pgUser:    process.env.POSTGRES_USER,
        pgPass:    process.env.POSTGRES_PASSWORD,
        port:      process.env.POSTGRES_PORT,
        host:      'localhost',
        database:  process.env.POSTGRES_DB,
        dbVersion: 7
      }
    },
    staging:     {
      rootPath:     rootPath,
      port:         8080,
      envString:    'staging',
      logFormat:    'dev',
      tokenSecret:  fs.readFileSync(rootPath + 'ssl/pub_lind_token.pem'),
      tokenOptions: {
        algorithm: 'HS256',
        expiresIn: 3600
      },
      db:           {
        pgUser:    process.env.POSTGRES_USER,
        pgPass:    process.env.POSTGRES_PASSWORD,
        port:      process.env.POSTGRES_PORT,
        host:      'db',
        database:  process.env.POSTGRES_DB,
        dbVersion: 7
      }
    }
  };

  module.exports = config[env];

}());
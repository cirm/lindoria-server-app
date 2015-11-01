//
(function () {
  'use strict';
  var clientPool = require('./clientPool');
  var Promise    = require('bluebird');
  var fs         = Promise.promisifyAll(require('fs'));

  var conf           = require('../config/conf');
  var releaseVersion = conf.db.dbVersion;

  var scriptVersion;
  var comment;


  var updateDb = function (content) {
    return clientPool.query(content, []);
  };

  var dbFunction = function (fname, scriptVersion, comment) {
    return clientPool.queryFunction(fname, [scriptVersion, comment]);
  };

  var getFilesForUpdate = function (dbVersion) {
    return fs.readdirAsync('./postgres/provision/')
      .map(function (file) {
        scriptVersion = parseInt(file.match(/\d+\./));
        if (scriptVersion > dbVersion && scriptVersion <= releaseVersion) {
          comment = /.{3}\.(\w+)\.sql/.exec(file)[1];
          return fs.readFileAsync('./postgres/provision/' + file, 'utf8')
            .then(function (content) {
              return updateDb(content);
            })
            .then(function () {
              return dbFunction('dbv.log_update', scriptVersion, comment);
            });
        }
      });
  };

  module.exports = {
    runDbProvision: getFilesForUpdate
  };
})();

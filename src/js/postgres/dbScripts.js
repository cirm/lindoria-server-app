//
(function () {
  'use strict';
  var clientPool = require('./clientPool');
  var Promise    = require('bluebird');
  var fs         = Promise.promisifyAll(require('fs'));

  var conf           = require('../config/conf');
  var releaseVersion = conf.db.dbVersion;


  var updateDb = function (scriptArr) {
    return clientPool.query(scriptArr[0], [])
      .then(function () {
        return dbFunction('dbv.log_update', scriptArr[1], scriptArr[2]);
      });
  };

  var dbFunction = function (fname, scriptVersion, comment) {
    return clientPool.queryFunction(fname, [scriptVersion, comment]);
  };

  var readDir = function () {
    return fs.readdirAsync('./postgres/provision/');
  };

  var readFiles = function (fileArr, dbVersion) {
    return Promise.map(fileArr, function (file) {
      var scriptVersion = parseInt(file.match(/\d+\./));
      if (scriptVersion > dbVersion && scriptVersion <= releaseVersion) {
        var comment = /.{3}\.(\w+)\.sql/.exec(file)[1];
        return fs.readFileAsync('./postgres/provision/' + file, 'utf8')
          .then(function (script) {
              return [script, scriptVersion, comment];
            }
          );
      } else {
        return false;
      }
    });
  };

  var getFilesForUpdate = function (dbVersion) {
    return readDir()
      .then(function (fileArr) {
        return readFiles(fileArr, dbVersion);
      })
      .then(function (scriptArr) {
        return Promise.each(scriptArr, function (sqlScript) {
          if (sqlScript !== false) {
            return updateDb(sqlScript);
          }
        });
      })
      .catch(function (err) {
        console.log(err.toString());
        return clientPool.query('ROLLBACK;', []);
      });
  };


  module.exports = {
    runDbProvision: getFilesForUpdate
  };
})();
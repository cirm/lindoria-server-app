//
(function () {
  'use strict';
  var clientPool = require('./clientPool');
  var Promise    = require('bluebird');
  var fs         = Promise.promisifyAll(require('fs'));

  var conf           = require('../config/conf');
  var releaseVersion = conf.db.dbVersion;
  var dbVersion;


  var getFilesForUpdate = function (dbVer) {
    dbVersion = dbVer;
    return readDir()
      .then(function (fileArr) {
        return readFiles(fileArr);
      })
      .then(function (scriptBundleArr) {
        return handleScriptsFromFiles(scriptBundleArr);
      })
      .catch(function (err) {
        return logErr(err);
      });
  };

   var readDir = function () {
    return fs.readdirAsync('./postgres/provision/');
  };

  var readFiles = function (fileArr) {
    return Promise.map(fileArr, function (file) {
      return handleFile(file);
    });
  };

  var handleFile = function (file) {
    var scriptVersion = parseInt(file.match(/\d+\./));
    if (scriptVersion > dbVersion && scriptVersion <= releaseVersion) {
      var comment = /.{3}\.(\w+)\.sql/.exec(file)[1];
      return fs.readFileAsync('./postgres/provision/' + file, 'utf8')
        .then(function (script) {
          return [script, scriptVersion, comment];
        });
    } else {
      return false;
    }
  };

  var handleScriptsFromFiles = function (scriptBundleArr) {
    return Promise.each(scriptBundleArr, function (scriptArr) {
      return handleScript(scriptArr);
    });
  };

  var handleScript = function (scriptArr) {
    if (scriptArr !== false) {
      return updateDb(scriptArr);
    } else {
      return false;
    }
  };

  var updateDb = function (scriptArr) {
    return clientPool.query(scriptArr[0], [])
      .then(function () {
        return clientPool.queryFunction('dbv.log_update', [scriptArr[1], scriptArr[2]]);
      });
  };

  var logErr = function (err) {
    console.log(err.toString());
    return clientPool.query('ROLLBACK', []);
  };


  module.exports = {
    runDbProvision: getFilesForUpdate
  };
})();
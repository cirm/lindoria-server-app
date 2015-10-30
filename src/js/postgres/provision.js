(function () {
  'use strict';

  var clientPool = require('./clientPool');
  var log = require('../utilities/logging');
  var Promise = require('bluebird');
  var fs = Promise.promisifyAll(require('fs'));
  var qs;
  var comment;
  var dbVersion;
  var scriptVersion;
  var conf = require('../config/conf');
  var releaseVersion = conf.db.dbVersion;


  var checkDbReleaseVersion = function () {
    qs = '' +
      'SELECT scl.version ' +
      'FROM dbv.schemaChangeLog scl ' +
      'ORDER BY version DESC ' +
      'LIMIT 1;';
    return clientPool.query(qs, []);
  };

  var updateDb = function (content) {
    return clientPool.query(content, []);
  };

  var dbFunction = function (fname, scriptVersion, comment) {
    return clientPool.queryFunction(fname, [scriptVersion, comment]);
  };

  var getFilesForUpdate = function () {
    return fs.readdirAsync('./build/postgres/provision/')
      .map(function (filename) {
        scriptVersion = parseInt(filename.match(/\d+\./));
        if (scriptVersion > dbVersion && scriptVersion <= releaseVersion) {
          comment = /.{3}\.(\w+)\.sql/.exec(file)[1];
          return fs.readFileAsync('./build/postgres/provision/' + file, 'utf8')
            .then(function (content) {
              return updateDb(content);
            })
            .then(function () {
              return dbFunction('dbv.log_update', scriptVersion, comment);
            });
        }
      });
  };

  var decideIfUpdateNeeded = function () {
    if (releaseVersion > dbVersion) {
      log.debug('Update Needed');
      return true;
    } else {
      log.debug('Db up-to date. Skipping provisioning');
      return false;
    }
  };

  var decideIfProvisionNeeded = function () {
    require('./provisionUsers');
  };

  var provisionDb = function () {
    checkDbReleaseVersion()
      .then(function (data) {
        dbVersion = data[0].version;
        return decideIfUpdateNeeded();
      })
      .then(function (state) {
        if (state) {
          return getFilesForUpdate();
        }
      })
      .then(function () {
        decideIfProvisionNeeded();
      })
      .catch(function (ex) {
        log.logErr(ex);
      });
  };

  module.exports = provisionDb();

})();

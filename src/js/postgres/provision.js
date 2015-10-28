(function () {
  'use strict';

  var clientPool = require('./clientPool');
  var log        = require('../utilities/logging');
  var Promise = require('bluebird');
  var fs = Promise.promisifyAll(require('fs'));
  var dbVersion;
  var qs;
  var conf = require('../config/conf');
  var releaseVersion = conf.db.dbVersion;


  var checkDbReleaseVersion = function () {
    qs = '' +
      'SELECT scl.version ' +
      'FROM dbv.schemaChangeLog scl ' +
      'ORDER BY version ' +
      'LIMIT 1;';
    return clientPool.query(qs, [])
  };

  var updateDb = function(content, version, comment) {
    clientPool.query(content, [])
      .then(clientPool.queryFunction('dbv.log_update' ,[version, comment]))
  };

  var getFilesForUpdate = function () {
    console.log('asdf');
    fs.readdirAsync('./build/postgres/provision/').map(function (filename) {
      var scriptVersion = parseInt(filename.match(/\d+\./));
      if (scriptVersion > dbVersion && scriptVersion <= releaseVersion ) {
        var comment = /.{3}\.(\w+)\.sql/.exec(filename)[1];
        console.log(comment);
        fs.readFileAsync('./build/postgres/provision/' + filename, "utf8")
          .then(function(content) {
            updateDb(content, scriptVersion, comment);
          });
      } else {
        console.log('troll');
      }
    })
  };

  var decideIfUpdateNeeded = function () {
    if (releaseVersion > dbVersion) {
      log.debug('Update Needed');
      getFilesForUpdate()
    } else {
      log.debug('Db up-to date. Skipping provisioning');
    }
  };

  var provisionDb = function () {
    checkDbReleaseVersion()
      .then(function(data){
        dbVersion = data[0].version;
        decideIfUpdateNeeded()
      })
      .catch(function(ex) {
        log.logErr(ex)
      })
  };

  module.exports = provisionDb();

})();

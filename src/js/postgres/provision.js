(function () {
  'use strict';

  var clientPool  = require('./clientPool');
  var log         = require('../utilities/logging');
  var dbProvision = require('./dbScripts');

  var conf           = require('../config/conf');
  var releaseVersion = conf.db.dbVersion;

  var qs;
  var dbVersion;


  var checkDbReleaseVersion = function () {
    qs = '' +
      'SELECT scl.version ' +
      'FROM dbv.schemaChangeLog scl ' +
      'ORDER BY version DESC ' +
      'LIMIT 1;';
    return clientPool.query(qs, []);
  };

  var isDbUpdateNeeded = function () {
    if (releaseVersion > dbVersion) {
      log.debug('Update Needed');
      return true;
    } else {
      log.debug('Db up-to date. Skipping provisioning');
      return false;
    }
  };

  var decideIfProvisionNeeded = function () {
    require('./defaultUsers');
  };

  var provisionDb = function () {
    checkDbReleaseVersion()
      .then(function (data) {
        dbVersion = data[0].version;
        return isDbUpdateNeeded();
      })
      .then(function (state) {
        if (state) {
          return dbProvision.runDbProvision(dbVersion);
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

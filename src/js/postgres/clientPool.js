(function () {
  'use strict';

  var promise = require('bluebird');
  var monitor = require('pg-monitor');
  var options = {promiseLib: promise};
  var pgp     = require('pg-promise')(options);
  var config  = require('../config/conf');

  monitor.attach(options); //attach to all events at once;

  var cn = {
    host    : config.db.host,
    port    : config.db.port,
    database: config.db.database,
    user    : config.db.pgUser,
    password: config.db.pgPass
  };

  var db = pgp(cn);

  var queryFunction = function (string, values) {
    db.func(string, values)
      .then(function (data) {
        return data[0];

      },
      function (reason) {
        return new Error(reason.toString());
      })
      .done();
  };

  var query = function (string, values) {
    return db.query(string, values);
  };

  module.exports = {
    queryFunction: queryFunction,
    query        : query
  };

})();
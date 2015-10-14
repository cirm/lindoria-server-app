(function () {
  'use strict';

  var promise = require('bluebird');
  var monitor = require('pg-monitor');
  var options = {promiseLib: promise};
  var pgp     = require('pg-promise')(options);
  var config  = require('../config/conf');
  var cn;
  var db;

  monitor.attach(options); //attach to all events at once;

  cn = {
    host    : config.db.host,
    port    : config.db.port,
    database: config.db.database,
    user    : config.db.pgUser,
    password: config.db.pgPass
  };

  db = pgp(cn);

  var queryFunction = function (string, values) {
  return  db.func(string, values)
  };

  var query = function (string, values) {
    return db.query(string, values);
  };

  module.exports = {
    queryFunction: queryFunction,
    query        : query
  };

})();
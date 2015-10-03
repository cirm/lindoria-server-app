(function () {

  'use strict';

  var q          = require('q')
    , pg         = require('pg')
    , config     = require('../config/conf');

  exports.query = function (queryString) {
    var results = [];
    var deferred = new q.defer();

    pg.connect(config.pgConnString, function (err, client, done) {

      // SQL Query > Select Data
      var query = client.query(queryString);

      // Stream results back one row at a time
      query.on('row', function (row) {
        results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function () {
        client.end();
        deferred.resolve(results);
      });

    });
    return deferred.promise;

  };

  exports.insert= function(queryString, data) {
    var results = [];
    var deferred = new q.defer();

    pg.connect(config.pgConnString, function (err, client, done) {

      // SQL Query > Select Data
      var query = client.query(queryString,
      data);

      // Stream results back one row at a time
      query.on('row', function (row) {
        results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function () {
        client.end();
        deferred.resolve(results)
      });

    });
    return deferred.promise;

  };
}());
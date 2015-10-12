//app/utilities/encryption.js
(function () {
  'use strict';

  var bcrypt = require('bcrypt');
  var q = require('q');


  exports.hashPwd = function (password, salt) {
    var deferred = q.defer();
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(hash);
      }
    });
    return deferred.promise;
  };


  exports.createSalt = function () {
    var deferred = q.defer();
    bcrypt.genSalt(12, function (err, salt) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(salt);
      }
    });
    return deferred.promise;
  };

  exports.compareHash = function (password, hash) {
    var deferred = q.defer();
    bcrypt.compare(password, hash, function (err, res) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(res);
      }
    });
    return deferred.promise;
  };


}());

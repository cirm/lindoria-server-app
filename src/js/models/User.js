//app/models/User.js
(function () {
  'use strict';

  var encrypt = require('../utilities/encryption');
  var q       = require('q');
  var db      = require('../main/postgresql');
  var log     = require('../utilities/logging');


  var userModel = function (data) {
    this.username       = data.username;
    this.displayName    = data.usr_display;
    this.salt           = data.salt;
    this.hashedPassword = data.hashed_pwd;
    this.roles          = data.roles;
  };

  userModel.prototype.authenticate = function (passwordToMatch) {
    return encrypt.compareHash(passwordToMatch, this.hashedPassword);
  };

  userModel.prototype.hasRole = function (role) {
    return this.roles.indexOf(role) > -1;
  };

  userModel.prototype.logVisit = function () {
    var qs    = 'SELECT web.log_visit($1);';
    var qData = [this.username];
    db.insert(qs, qData)
      .catch(function (err) {
        log.logErr(err);
      })
      .done();
  };

  userModel.prototype.updatePassword = function () {
    var deferred = new q.defer();
    var qs       = 'SELECT web.update_password($1, $2, $3);';
    var qData    = [this.username, this.salt, this.hashedPassword];
    db.insert(qs, qData)
      .then(function queryPromise(data) {
        deferred.resolve(data[0].update_password);
      })
      .catch(function (err) {
        log.logErr(err);
        deferred.reject(new Error(err.toString()));
      })
      .done();
    return deferred.promise;
  };

  userModel.prototype.updateDisplay = function () {
    var deferred = new q.defer();
    var qs       = 'SELECT web.update_user($1, $2);';
    var qData    = [this.username, this.displayName];
    db.insert(qs, qData)
      .then(function queryPromise(data) {
        deferred.resolve(data[0].update_user);
      })
      .catch(function (err) {
        log.logErr(err);
        deferred.reject(new Error(err.toString()));
      })
      .done();
    return deferred.promise;
  };

  module.exports = userModel;

})();

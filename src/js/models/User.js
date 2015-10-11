//app/models/User.js
(function () {
  'use strict';

  var encrypt = require('../utilities/encryption')
    , db      = require('../main/postgresql')
    , log     = require('../utilities/logging');


  var userModel = function (data) {
    this.username    = data.username;
    this.usr_display = data.usr_display;
    this.salt        = data.salt;
    this.hashed_pwd  = data.hashed_pwd;
    this.roles       = data.roles;
  };

  userModel.prototype.authenticate = function (passwordToMatch) {
    return encrypt.compareHash(passwordToMatch, this.hashed_pwd);
  };

  userModel.prototype.hasRole = function (role) {
    return this.roles.indexOf(role) > -1;
  };

  userModel.prototype.save = function () {
    var qs    = 'SELECT web.update_user($1, $2);';
    var qData = [this.username, this.usr_display];
    db.insert(qs, qData)
      .catch(function (err) {
        log.logErr(err);
      })
      .done();
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
    var qs    = 'SELECT web.update_password($1, $2, $3);';
    var qData = [this.username, this.salt, this.hashed_pwd];
    db.insert(qs, qData)
      .catch(function (err) {
        log.logErr(err);
      })
      .done();
  };

  userModel.prototype.updateDisplay = function () {
    var qs    = 'SELECT web.update_user($1, $2);';
    var qData = [this.username, this.usr_display];
    db.insert(qs, qData)
      .catch(function (err) {
        log.logErr(err);
      })
      .done();
  };

  module.exports = userModel;

})();

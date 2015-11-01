//app/models/User.js
(function () {
  'use strict';

  var encrypt = require('../utilities/encrypt');


  var userModel = function (data, options) {
    if (!options.db) {
      throw new Error('Options.db is required');
    }

    this.db = options.db;

    this.username       = data.username;
    this.displayName    = data.display;
    this.salt           = data.salt;
    this.hashedPassword = data.hpassword;
    this.roles          = data.roles;
  };

  userModel.prototype.authenticate = function (passwordToMatch) {
    return encrypt.compareHash(passwordToMatch, this.hashedPassword);
  };

  userModel.prototype.hasRole = function (role) {
    return this.roles.indexOf(role) > -1;
  };

  userModel.prototype.logVisit = function () {
    var qs    = 'web.log_visit';
    var qData = [this.username];
    return this.db.queryFunction(qs, qData);
  };

  userModel.prototype.updatePassword = function () {
    var qs    = 'web.update_password';
    var qData = [this.username, this.salt, this.hashedPassword];
    return this.db.queryFunction(qs, qData);
  };

  userModel.prototype.updateDisplay = function () {
    var qs    = 'web.update_user';
    var qData = [this.username, this.displayName];
    return this.db.queryFunction(qs, qData);
  };

  module.exports = userModel;

})();

//app/utilities/encrypt.js
(function () {
  'use strict';

  var Promise = require('bluebird');
  var bcrypt  = Promise.promisifyAll(require('bcrypt'));


  var hashPassword = function (password, salt) {
    return bcrypt.hashAsync(password, salt);
  };

  var createSalt = function () {
    return bcrypt.genSaltAsync(12);
  };

  var compareHash = function (password, hashedPassword) {
    return bcrypt.compareAsync(password, hashedPassword);
  };

  module.exports = {
    hashPassword: hashPassword,
    createSalt  : createSalt,
    compareHash : compareHash
  };

}());

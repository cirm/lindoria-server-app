(function () {
  'use strict';

  var userNotFound = function () {
    throw new Error('User not found');
  };

  var authenticationFailed = function () {
    throw new Error('Authentication failed');
  };

  var custom = function (err) {
    throw new Error(err.toString());
  };

  module.exports = {
    userNotFound        : userNotFound,
    authenticationFailed: authenticationFailed,
    customError         : custom
  };

})();
(function () {
  'use strict';

  var Promise = require('bluebird');
  var jwt = Promise.promisifyAll(require('jsonwebtoken'));
  var config = require('../config/conf');
  var profile;

  var generateToken = function (user) {
    profile = {
      username: user.username,
      display : user.displayName,
      roles   : user.roles
    };
    return jwt.sign(profile, config.tokenSecret, config.tokenOptions);
  };

  module.exports = {
    getToken : generateToken
  };

})();
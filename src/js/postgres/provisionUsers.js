(function () {
  'use strict';

  var clientPool   = require('./clientPool');
  var log          = require('../utilities/winston');
  var encrypt      = require('../utilities/encryption');
  var defaultUsers = require('../config/defaultUsers');

  var checkUsers = function () {
    var qs =
          'SELECT * ' +
          'FROM web.users;';
    return clientPool.query(qs, []);
  };

  var insertUser = function (userObject) {
    var uo = userObject;
    encrypt.createSalt().then(function (salt) {
      return encrypt.hashPwd(uo.password, salt);
    }).then(function (hashedPassword) {
      var qData = [
        uo.displayName,
        uo.username,
        salt,
        hashedPassword,
        uo.roles
      ];
      return clientPool.function('web.create_user', qData);
    }).then(function (queryResult) {
      var user = queryResult[0].create_user;
      log.debug(
        'Inserted username: ' + user.username +
        ' with display name: ' + user.displayName
      );
    });
  };

  var insertUsers = function (userList) {
    var len = userList.length;
    console.log(len);
    for (var i = 0; i < len; i++) {
      insertUser(userlist[i]);
    }
  };

  var createDefaultUsers = function () {
    checkUsers().then(function (dbResponse) {
      if (dbResponse.length === 0) {
        log.debug('No users found, provisioning!');
        insertUsers(defaultUsers);
      } else {
        log.debug('Found users, skipping db user provisioning.');
      }
    });
  };

  module.exports = createDefaultUsers();

})();
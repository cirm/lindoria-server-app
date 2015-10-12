(function () {

  'use strict';

  var dbQuery      = require('./postgresql');
  var q            = require('q');
  var log          = require('../utilities/winston');
  var encrypt      = require('../utilities/encryption');
  var defaultUsers = require('../config/defaultUsers');


  var insertUsers = function (userList) {
    var len = userList.length;
    for (var i = 0; i < len; i++) {
      insertUser(userList[i]);
    }
  };

  var createDefaultUsers = function () {
    checkUsers()
      .then(function handleDbResult(users) {
        if (users.length === 0) {
          log.debug('No users found, provisioning.');
          insertUsers(defaultUsers);
        }
        else {
          log.debug('Found users, skipping db user provision.');
        }
      }
    );
  };

  var insertUser = function (userObject) {
    var uo = userObject;
    encrypt.createSalt()
      .then(function handleSaltPromise(salt) {
        encrypt.hashPwd(uo.password, salt)
          .then(function handleHashPromise(hashedPassword) {
            var qs    = 'SELECT web.create_user($1, $2, $3, $4, $5);';
            var qData = [
              uo.displayName,
              uo.username,
              salt,
              hashedPassword,
              uo.roles
            ];
            dbQuery.insert(qs, qData)
              .then(function dbResult(data) {
                data = data[0].create_user;
                log.debug(
                  'Inserted username: ' + data.username +
                  ' with display name: ' + data.displayName
                );
              });

          });
      });
  };

  var checkUsers = function () {
    var deferred = q.defer();
    var qs       = 'SELECT * ' +
      'FROM web.users;';
    dbQuery.query(qs)
      .then(function dbResult(data) {
        deferred.resolve(data);
      });
    return deferred.promise;
  };

  module.exports = function () {
    createDefaultUsers();
  };

}());

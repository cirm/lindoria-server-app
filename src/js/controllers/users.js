//app/controllers/users.js
(function () {
  'use strict';

  var Promise    = require('bluebird');
  var User       = require('../models/User');
  var encrypt    = require('../utilities/encrypt');
  var errors     = require('../utilities/errors');
  var jwt        = require('../utilities/token');
  var log        = require('../utilities/logging');
  var clientPool = require('../postgres/clientPool');
  var user;


  var queryUser = function (username) {
    var qs    = 'SELECT row_to_json(t) ' +
      'FROM (SELECT * ' +
      'FROM web.users ' +
      'WHERE username = $1) t;';
    var qData = [username];
    return clientPool.query(qs, qData).then(function (response) {
      if (!response[0]) {
        errors.userNotFound();
      }
      return new User(response[0].row_to_json, {db: clientPool});
    });

  };

  var updatePassword = function (userUpdates, user) {
    return encrypt.createSalt().then(function (salt) {
      return encrypt.hashPassword(userUpdates.password, salt);
    }).then(function (passwordHash) {
      user.hashedPassword = passwordHash;
      return user.updatePassword().then(function (data) {
        return data;
      });
    });
  };

  var handlePasswordUpdate = function (userUpdates, user) {
    if (userUpdates.password && userUpdates.password.length > 0) {
      user.authenticate(userUpdates.password).then(function (result) {
        if (result !== false) {
          return false;
        } else {
          return updatePassword(userUpdates, user);
        }
      });
    } else {
      return false;
    }
  };
  var handleDisplayUpdate  = function (userUpdates, user) {
    if (user.displayName !== userUpdates.display) {
      user.displayName = userUpdates.display;
      return user.updateDisplay().then(function () {
        return user;
      });
    } else {
      return false;
    }
  };

  var updateUser = function (req, res) {
    var userUpdates = req.body;
    if (req.Authorization.username !== userUpdates.username &&
      !req.Authorization.hasRole('admin')) {
      //if (true) {then do.}
      return res.status(403).end();
    }
    queryUser(req.Authorization.username)
      .then(function (userObject) {
        user = userObject;
        return Promise.all([
          handlePasswordUpdate(userUpdates, user),
          handleDisplayUpdate(userUpdates, user)
        ]);
      }).then(function () {
        return jwt.getToken(user);
      }).then(function (token) {
        res.json({token: token});
      }).catch(function (err) {
        log.logErr(err.toString());
        return res.status(403).end();
      }).done();
  };

  var queryUsers = function (req, res) {
    var qs = 'SELECT username, display, roles, visited from web.users';
    clientPool.query(qs, [])
      .then(function dbResultPromise(collection) {
        res.send(collection);
      }).catch(function (err) {
        log.logErr(err.toString());
      }).done();
  };


  module.exports = {
    updateUser: updateUser,
    getUsers  : queryUsers,
    queryUser : queryUser
  };


})();
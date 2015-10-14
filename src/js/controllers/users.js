//app/controllers/users.js
(function () {
  'use strict';

  var User       = require('../models/User');
  var encrypt    = require('../utilities/encrypt');
  var errors     = require('../utilities/errors');
  var auth       = require('./authenticate');
  var q          = require('q');
  var Promise    = require('bluebird');
  var clientPool = require('../postgres/clientPool');
  var options    = {db: clientPool};
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
      return new User(response[0].row_to_json, options);
    });

  };

  var updatePassword = function (userUpdates, user) {
    return encrypt.createSalt().then(function (salt) {
      return encrypt.hashPassword(userUpdates.password, salt)
    }).then(function (passwordHash) {
      user.hashedPassword = passwordHash;
      return user.updatePassword().then(function (data) {
        return data;
      })
    })
  };

  var handlePasswordUpdate = function (userUpdates, user) {
    if (userUpdates.password && userUpdates.password.length > 0) {
      user.authenticate(userUpdates.password).then(function (result) {
        if (result !== false) {
          console.log('x');
          return false;
        } else {
          console.log('z');
          return updatePassword(userUpdates, user);
        }
      });
    } else {
      console.log('b');
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
  var updateUserQuery      = function (userUpdates, user) {
    var deferred = new q.defer();
    if (user.displayName !== userUpdates.display) {
      user.displayName = userUpdates.display;
      user.updateDisplay()
        .then(function () {
          var token = auth.getToken(user);
          deferred.resolve(token);
        }).catch(function (err) {
        deferred.reject(new Error(err.toString()));
      }).done();
    } else {
      deferred.resolve(user);
    }
    return deferred.promise;
  };

  var renewToken = function (user) {
    auth.getToken(user).then(function (token) {
      return token
    })
  };

  var updateUser = function (req, res) {
    var userUpdates = req.body;
    if (req.Authorization.username !== userUpdates.username && !req.Authorization.hasRole('admin')) {
      //if (true) {then do.}
      return res.status(403).end();
    }
    queryUser(req.Authorization.username)
      .then(function (user) {
        return Promise.all([handlePasswordUpdate(userUpdates, user), handleDisplayUpdate(userUpdates, user)]);
      }).then(function (results) {
      console.log(results);
      if (results.indexOf(true) > -1) {
        renewToken(user).then(function (token) {
          res.json({token: token})
        })
      } else {
        res.status(200).end();
      }
    }).catch(function (err) {
      console.log(err.toString());
      res.status(403).end();
    }).done();
  };

  var queryUsers = function (req, res) {
    var qs = 'SELECT username, usr_display, roles, visited_at from web.users';
    clientPool.query(qs, [])
      .then(function dbResultPromise(collection) {
        res.send(collection);
      }).catch(function (err) {
      console.log(err.toString());
    }).done();
  };


  module.exports = {
    updateUser: updateUser,
    getUsers  : queryUsers,
    queryUser : queryUser
  };


}());
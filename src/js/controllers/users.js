//app/controllers/users.js
(function () {
  'use strict';

  var User    = require('../models/User')
    , encrypt = require('../utilities/encryption')
    , auth    = require('./authenticate')
    , db      = require('../main/postgresql')
    , q       = require('q');

  var queryUser = function (username) {
    var deferred = new q.defer();
    var qs = 'SELECT row_to_json(t) FROM (SELECT * FROM web.users WHERE username = $1) t;';
    var qData = [username];
    db.insert(qs, qData)
      .then(function queryPromise(result) {
        var data = result[0].row_to_json;
        var user = new User(data);
        deferred.resolve(user);
      })
      .catch(function errPromise(rejected) {
        deferred.reject(rejected);
      })
      .done();
    return deferred.promise;
  };

  var handlePasswordUpdate = function (userUpdates, user) {
    var deferred = new q.defer();
    if (userUpdates.password && userUpdates.password.length > 0) { //if has 'new' password.
      encrypt.createSalt()
        .then(function saltPromise(salt) {
          user.salt = salt;
          encrypt.hashPwd(userUpdates.password, salt)
            .then(function hashPromise(hash) {
              user.hashed_pwd = hash;
              deferred.resolve(user);
            });
        });
    }
    else {
      deferred.resolve(user);
    }
    return deferred.promise;
  };

  var updateUserQuery = function (userUpdates, user) {
    var deferred = new q.defer();
    user.usr_display = userUpdates.display;
    user.save()
      .then(function () {
        var token = auth.getToken(user);
        deferred.resolve(token);
      }).catch(function (err) {
        deferred.reject(new Error(err.toString()));
      }).done();
    return deferred.promise;
  };

  module.exports = {
    updateUser: function (req, res) {
      var userUpdates = req.body;
      if (req.Authorization.username !== userUpdates.username && !req.Authorization.hasRole('admin')) {
        //if (true) {then do.}
        return res.status(403).end();
      }
      queryUser(req.Authorization.username)
        .then(function (user) {
          handlePasswordUpdate(userUpdates, user)
            .then(function pwdUpdatePromise(user) {
              updateUserQuery(userUpdates, user)
                .then(function tokenPromise(token) {
                  res.json({token: token});
                });
            });
        })
        .
        catch(function (err) {
          console.log(err.toString());
        }).done();
    },

    getUsers : function (req, res) {
      var qs = 'SELECT username, usr_display from web.users';
      db.query(qs)
        .then(function dbResultPromise(collection) {
          res.send(collection);
        }
      );
    },
    queryUser: function (username) {
      return queryUser(username);
    }
  };


}());
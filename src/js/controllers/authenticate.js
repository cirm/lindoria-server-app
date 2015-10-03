(function () {
  'use strict';

  var jwt    = require('jsonwebtoken')
    , users  = require('../controllers/users')
    , config = require('../config/conf')
    , log    = require('../utilities/logging');


  exports.requiresRole = function (role) {
    return function (req, res, next) {
      if (!req.Authorization || req.Authorization.roles.indexOf(role) === -1) {
        res.status(403).end();
      } else {
        next();
      }
    };
  };

  var generateToken = function (user) {
    var profile = {
      username: user.username,
      display : user.usr_display,
      roles   : user.roles
    };
    return jwt.sign(profile, config.tokenSecret, config.tokenOptions);
  };

  var getUserData = function (reqUser) {
    return users.queryUser(reqUser);
  };

  exports.authUser = function (req, res) {
    getUserData(req.body.username)
      .then(function handleUserPromise(user) {
        user.authenticate(req.body.password)
          .then(function handleAuthPromise(authResult) {
            if (authResult !== true) {
              res.status(401).send('Invalid password or username');
            } else {
              var token = generateToken(user);
              res.json({token: token});
            }
          });
      })
      .catch(function (err) {
        log.logErr(err);
        res.status(401).send('Invalid password or username');
      })
      .done();
  };

  exports.getToken = function (data) {
    return generateToken(data);
  };

}());
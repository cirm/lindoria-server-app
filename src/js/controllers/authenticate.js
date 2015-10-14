(function () {
  'use strict';

  var jwt     = require('jsonwebtoken');
  var users   = require('../controllers/users');
  var config  = require('../config/conf');
  var log     = require('../utilities/logging');
  var User    = require('../models/User');
  var db      = require('../postgres/clientPool');
  var error   = require('../utilities/errors');
  var options = {db: db};
  var profile;
  var token;
  var user;


  var checkHasRole = function (role) {
    return function (req, res, next) {
      if (!req.Authorization || req.Authorization.roles.indexOf(role) === -1) {
        res.status(403).end();
      } else {
        next();
      }
    };
  };

  var generateToken = function (user) {
    profile = {
      username: user.username,
      display : user.displayName,
      roles   : user.roles
    };
    return jwt.sign(profile, config.tokenSecret, config.tokenOptions);
  };

  var doAuthenticateFlow = function (req, res) {
    users.queryUser(req.body.username).then(function populateUser(response) {
      if (!response[0]) {
        error.userNotFound();
      } else {
        user = new User(response[0].row_to_json, options);
      }
    }).then(function doPasswordCheck() {
      return user.authenticate(req.body.password);
    }).then(function authResult(result) {
      if (result !== true) {
        error.authenticationFailed();
      } else {
        user.logVisit();
        token = generateToken(user);
        res.json({token: token});
      }
    }).catch(function handleError(err) {
      log.logErr(err);
      res.status(401).send('Invalid password or username');
    }).done();
  };

  module.exports = {
    authUser    : doAuthenticateFlow,
    requiresRole: checkHasRole,
    getToken    : generateToken
  };

}());
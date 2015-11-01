(function () {
  'use strict';

  var jwt    = require('../utilities/token');
  var users  = require('../controllers/users');
  var config = require('../config/conf');
  var log    = require('../utilities/logging');
  var error  = require('../utilities/errors');
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


  var doAuthenticateFlow = function (req, res) {
    users.queryUser(req.body.username)
      .then(function doPasswordCheck(userObject) {
        user = userObject;
        return user.authenticate(req.body.password);
      }).then(function authResult(result) {
      if (result !== true) {
        error.authenticationFailed();
      } else {
        user.logVisit();
        return jwt.getToken(user);
      }
    }).then(function (token) {
      res.json({token: token});
    }).catch(function handleError(err) {
      log.logErr(err);
      res.status(401).send('Invalid password or username');
    }).done();
  };

  module.exports = {
    authUser:     doAuthenticateFlow,
    requiresRole: checkHasRole
  };

}());
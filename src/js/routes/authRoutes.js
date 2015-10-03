//app/routes/authRoutes.js
(function () {
  'use strict';

  var auth = require('../controllers/authenticate');

  module.exports = function (app) {

    app.post('/auth', auth.authUser);

  };

}());
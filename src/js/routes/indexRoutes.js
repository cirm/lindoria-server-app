(function () {
  'use strict';

  var users = require('../controllers/users'),
    auth = require('../controllers/authenticate');

  module.exports = function (app) {

    app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
    app.put('/api/users/:username', users.updateUser);

    app.get('*', function (req, res) {
      res.render('index');
    });


  };

}());
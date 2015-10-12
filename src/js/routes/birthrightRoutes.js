//app/routes/BirthrightRoutes.js
(function () {
  'use strict';

  //, relations = require('../controllers/relations')
  module.exports = function (app) {
    require('./domainRoutes')(app);
    require('./provinceRoutes')(app);
    require('./holdingRoutes')(app);
  };
}());

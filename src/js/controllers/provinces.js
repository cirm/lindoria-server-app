//src/js/controllers/provinces.js
(function () {
  'use strict';

  var db = require('../postgres/clientPool');

  exports.getProvinces = function (req, res) {
    db.queryFunction('empires.get_provinces', [])
      .then(function(data) {
        res.send(data);
      })
      .catch(function(err) {
        res.status(200).send(err.toString());
      })
      .done();
  };


})();
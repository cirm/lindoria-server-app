//src/js/routes/provinceRoutes.js
(function () {
  'use strict';

  var provinces = require('../controllers/provinces');

  module.exports = function (app) {
    app.get('/api/provinces', provinces.getProvinces);
    //app.get('/api/provinces/:name', provinces.getProvinceByName);
    //app.get('/api/provinces/holdings', provinces.getProvincesPopulation);
    //app.post('/api/provinces/:name', provinces.createProvince);
    //app.put('/api/provinces/:name', provinces.updateProvince);
    //app.delete('/api/provinces/:name', provinces.deleteProvince);
  };
})();
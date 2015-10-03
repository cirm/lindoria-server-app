//app/routes/BirthrightRoutes.js
(function () {
  'use strict';

  var domains   = require('../controllers/domains')
    //, relations = require('../controllers/relations')
    , holdings  = require('../controllers/holdings')
    , provinces = require('../controllers/provinces');

  module.exports = function (app) {
    app.get('/api/domains/', domains.getDomains);
    app.get('/api/domains/:name', domains.getDomainByName);
    app.get('/api/domains/:name/provinces', domains.getDomainsPopulation);
    app.post('/api/domains/', domains.createDomain);
    app.put('/api/domains/:name', domains.updateDomain);
    app.delete('/api/domains/:name', domains.deleteDomain);

    app.get('/api/provinces', provinces.getProvinces);
    app.get('/api/provinces/:name', provinces.getProvinceByName);
    app.get('/api/provinces/holdings', provinces.getProvincesPopulation);
    app.post('/api/provinces/:name', provinces.createProvince);
    app.put('/api/provinces/:name', provinces.updateProvince);
    app.delete('/api/provinces/:name', provinces.deleteProvince);

    //app.get('/api/provinces/:provinceName/holdings', province.getProvinceHoldings);

    //app.get('/api/holdings', holdings.getHolding);
    app.get('/api/holdings/:id', holdings.getHoldingById);
    app.post('/api/holdings/', holdings.createHolding);
    app.put('/api/holdings/:id', holdings.updateHolding);
    app.delete('/api/holdings/:id', holdings.deleteHolding);

    //app.put('/api/provinces/:provinceName/holdings/:holdingId', relations.createProvToHold);
    //app.put('/api/domains/:domainName/provinces/:provinceName', relations.createDomtoProv);

    //app.delete('/api/provinces/:provinceName/holdings/:holdingId', relations.removeProvToHold);
    //app.delete('/api/domains/:domainName/provinces/:provinceName', relations.removeDomtoProv);
  };
}());

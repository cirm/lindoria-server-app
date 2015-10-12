(function () {
  'use strict';

  var domains = require('../controllers/domains');

  module.exports = function (app) {
    app.get('/api/domains/', domains.getDomains);
    app.get('/api/domains/:name', domains.getDomainByName);
    app.get('/api/domains/:name/provinces', domains.getDomainsPopulation);
    app.post('/api/domains/', domains.createDomain);
    app.put('/api/domains/:name', domains.updateDomain);
    app.delete('/api/domains/:name', domains.deleteDomain);
  };

})();
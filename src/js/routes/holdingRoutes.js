(function () {
  'use strict';

  var holdings = require('../controllers/holdings');
  
  module.exports = function (app) {
    app.get('/api/holdings/:id', holdings.getHoldingById);
    app.post('/api/holdings/', holdings.createHolding);
    app.put('/api/holdings/:id', holdings.updateHolding);
    app.delete('/api/holdings/:id', holdings.deleteHolding);
  };
})();
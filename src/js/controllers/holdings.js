//app/controllers/holdings.js
(function () {
  'use strict';
  var Holding   = require('mongoose').model('Holding');
  var handleErr = require('../utilities/logging');


  exports.getHoldingById = function (req, res) {
    Holding.findById(req.params.id).exec(function (err, holding) {
      if (err) {
        return handleErr.resErr(err, res);
      } else {
        res.send(holding);
      }
    });
  };

  exports.createHolding = function (req, res) {
    var holdingData = req.body;
    Holding.create(holdingData, function (err, holding) {
      if (err) {
        return handleErr.resErr(err, res);
      } else {
        res.send(holding);
      }
    });
  };

  exports.updateHolding = function (req, res) {
    var holdingData = req.body;
    Holding.findByIdAndUpdate(req.params.id, holdingData, {new: true}).exec(function (err, holding) {
      if (err) {
        return handleErr.resErr(err, res);
      } else {
        res.send(holding);
      }
    });
  };

  exports.deleteHolding = function (req, res) {
    Holding.findByIdAndRemove(req.params.id).exec(function (err) {
      if (err) {
        return handleErr.resErr(err, res);
      }
      return res.end();
    });
  };
}());
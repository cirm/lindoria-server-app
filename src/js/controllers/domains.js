//app/controllers/domains.js
(function () {
  'use strict';

  var Domain    = require('mongoose').model('Domain');
  var handleErr = require('../utilities/logging');


  exports.getDomains = function (req, res) {
    Domain.find({}).exec(function (err, collection) {
      res.send(collection);
    });
  };

  exports.getDomainByName = function (req, res) {
    Domain.findOne({name: req.params.name}).exec(function (err, domain) {
      if (err) {
        return handleErr.resErr(err, res);
      } else {
        res.send(domain);
      }
    });
  };

  exports.createDomain = function (req, res) {
    var domainData  = req.body;
    domainData.name = domainData.name.toLowerCase();
    Domain.create(domainData, function (err, domain) {
      if (err) {
        if (err.toString().indexOf('E11000') > -1) {
          err = new Error('Duplicate Domain');
        }
        return handleErr.resErr(err, res);
      }
      res.send(domain);
    });
  };

  exports.updateDomain = function (req, res) {
    var domainData  = req.body;
    domainData.name = domainData.name.toLowerCase();

    Domain.findOneAndUpdate({name: req.params.name}, domainData, {new: true}).exec(function (err, domain) {
      if (err) {
        if (err.toString().indexOf('E11000') > -1) {
          err = new Error('Domain name already in use');
        }
        return handleErr.resErr(err, res);
      }
      res.send(domain);
    });

  };

  exports.getDomainsPopulation = function (req, res) {
    Domain.findOne({name: req.params.name}).populate('provinces').exec(function (err, domain) {
      if (err) {
        res.status(400);
        return res.send({reason: err.toString()});
      } else {
        res.send(domain);
      }
    });
  };

  exports.deleteDomain = function (req, res) {
    Domain.remove({_id: req.params.id}, function (err) {
      if (err) {
        return handleErr.resErr(err, res);
      }
      return res.end();
    });
  };
}());
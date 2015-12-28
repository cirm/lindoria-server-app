(function () {
  'use strict';

  var Promise       = require('bluebird');
  var persons       = require('../provision/empires/persons');
  var domains       = require('../provision/empires/domains');
  var provinces     = require('../provision/empires/provinces');
  var organizations = require('../provision/empires/organizations');
  var holdings      = require('../provision/empires/holdings');
  var clientPool    = require('./clientPool');
  var log           = require('../utilities/logging');

  var checkData = function () {
    var qs =
          'SELECT * ' +
          'FROM empires.provinces;';
    return clientPool.query(qs, []);
  };

  var insertData = function () {
    return Promise.map(persons, function (person) {
      return insertPerson(person);
    }).then(function () {
      return Promise.map(domains, function (domain) {
        return insertDomain(domain);
      });
    }).then(function () {
      return Promise.map(provinces, function (province) {
        return insertProvince(province);
      });
    }).then(function () {
        return Promise.map(organizations, function (org) {
          return insertOrg(org);
        });
      })
      .then(function () {
        return Promise.map(holdings, function (holding) {
          return insertHolding(holding);
        });
      }).catch(function (err) {
        log.logErr(err);
      });
  };

  var insertOrg = function (org) {
    return clientPool.queryFunction('empires.create_organization', [
      org.oname,
      org.display,
      org.owner,
      org.abbr,
      org.treasury])
  };

  var insertHolding = function (holding) {
    return clientPool.queryFunction('empires.create_holding', [
      holding.level,
      holding.owner,
      holding.province,
      holding.type])
  };

  var insertDomain = function (domain) {
    return clientPool.queryFunction('empires.create_domain', [
      domain.dname,
      domain.regent,
      domain.display,
      domain.abbr,
      domain.treasury
    ]);
  };

  var insertProvince = function (province) {
    return clientPool.queryFunction('empires.create_province', [
      province.pname,
      province.display,
      province.level,
      province.regent,
      province.loyalty,
      province.domain,
      province.visible,
      province.abbr
    ]);
  };

  var insertPerson = function (person) {
    return clientPool.queryFunction('empires.create_person', [
      person.pname,
      person.display
    ]);
  };


  var createTestData = function () {
    checkData().then(function (dbResponse) {
      if (dbResponse.length === 0) {
        log.debug('No data found, provisioning!');
        insertData();
      } else {
        log.debug('Found data, skipping db data provisioning.');
      }
    });

  };

  module.exports = createTestData();
})();
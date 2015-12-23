(function () {
  'use strict';

  var data = require('../config/defaultEmpires');
  var persons = data.persons;
  var domains = data.domains;
  var provinces = data.provinces;
  var clientPool = require('./clientPool');
  var log = require('../utilities/logging');

  var checkData = function () {
    var qs =
      'SELECT * ' +
      'FROM empires.provinces;';
    return clientPool.query(qs, []);
  };

  var insertData = function () {
    var len = persons.length;
    for (var i = 0; i < len; i++) {
      insertPerson(persons[i]);
    }
    len = domains.length;
    for (var z = 0; z < len; z++) {
      insertDomain(domains[z]);
    }
    len = provinces.length;
    for (var g = 0; g < len; g++) {
      insertProvince(provinces[g]);
    }
  };

  var insertDomain = function (domain) {
    var qdata = [
      domain.dname,
      domain.regent,
      domain.display,
      domain.abbr,
      domain.treasury
    ];
    return clientPool.queryFunction('empires.create_domain', qdata);
  };

  var insertProvince = function (province) {
    var qdata = [
      province.pname,
      province.display,
      province.level,
      province.regent,
      province.loyalty,
      province.domain,
      province.visible,
      province.abbr
    ];
    return clientPool.queryFunction('empires.create_province', qdata);
  };

  var insertPerson = function (person) {
    var qdata = [
      person.pname,
      person.display
    ];
    return clientPool.queryFunction('empires.create_person', qdata);
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
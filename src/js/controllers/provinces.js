//app/controllers/provinces.js
(function () {
  'use strict';
  var Province = require('mongoose').model('Province')
    , handleErr = require('../utilities/logging');

  exports.getProvincesPopulation = function (req, res) {
    Province.find({}).populate('holding.guild holding.law holding.source holding.temple').exec(function (err, collection) {
      res.send(collection);
    });
  };

  exports.getProvinces = function (req, res) {
    Province.find({}).populate('holding.guild holding.law holding.source holding.temple domain').exec(function (err, collection) {
      res.send(collection);
    });
  };

  exports.createProvince = function (req, res) {
    var provinceData = req.body;
    provinceData.name = provinceData.name.toLowerCase();
    Province.create(provinceData, function (err, province) {
      if (err) {
        if (err.toString().indexOf('E11000') > -1) {
          err = new Error('Duplicate Province');
        }
        return handleErr.resErr(err, res);
      }
      res.send(province);
    });
  };

  exports.getProvinceByName = function (req, res) {
    Province.findOne({name: req.params.name}).exec(function (err, province) {
      if (err) {

        return res.status(400).send({reason: err.toString()});
      }
      res.send(province);
    });
  };


  exports.updateProvince = function (req, res) {
    var provinceData = req.body;
    provinceData.name = provinceData.name.toLowerCase();
    Province.findOneAndUpdate({name: provinceData.name}, provinceData, {new: true}).exec(function (err, province) {
      if (err) {
        if (err.toString().indexOf('E11000') > -1) {
          err = new Error('Province name already in use');
        }
        return handleErr.resErr(err, res);
      }
      res.send(province);
    });
  };

  exports.deleteProvince = function (req, res) {
    Province.remove({name: req.params.name}, function (err) {
      if (err) {
        return handleErr.resErr(err, res);
      }
      return res.end();
    });
  };
}());


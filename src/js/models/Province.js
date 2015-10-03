//app/models/Province.js
(function () {
  'use strict';
  var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

  var provinceSchema = mongoose.Schema({
    name   : {
      type    : String,
      required: '{PATH} is required!',
      unique  : true
    },
    display: String,
    abbr   : String,
    level  : Number,
    regent : String,
    loyalty: Number,
    domain : {type: Schema.Types.ObjectId, ref: 'Domain'},
    terrain: String,
    assets : {
      castle: {
        name : String,
        level: Number
      },
      palace: {
        name : String,
        level: Number
      },
      city  : String
    },
    holding: {
      guild : [{type: Schema.Types.ObjectId, ref: 'Holding'}],
      law   : [{type: Schema.Types.ObjectId, ref: 'Holding'}],
      temple: [{type: Schema.Types.ObjectId, ref: 'Holding'}],
      source: {person: String, level: Number}
    },
    misc   : [String],
    trade  : {
      roads  : Number,
      bridges: String,
      harbour: String
    }
  });

  var Province = mongoose.model('Province', provinceSchema);

  function createDefaultProvinces() {
    Province.find({}).exec(function (err, collection) {
      if (collection.length === 0) {
        Province.create({
          name   : 'llindoria',
          display: 'Lõuna-Lindoria',
          level  : 2,
          regent : 'Mauza',
          loyalty: 3,
          terrain: 'forrest',
          trade  : {
            roads: 3
          }
        });
        Province.create({
          name   : 'vlindoria',
          display: 'Vana-Lindoria',
          level  : 3,
          regent : 'Mauza',
          loyalty: 3,
          terrain: 'plains',
          assets : {
            city  : 'Lindoria',
            palace: {name: 'Lindoricon', level: 2}
          },
          trade  : {
            roads  : 3,
            bridge : 'Stone',
            harbour: 'Fishing'
          }
        });
        Province.create({
          name   : 'plindoria',
          display: 'Põhja-Lindoria',
          level  : 1,
          regent : 'Mauza',
          loyalty: 3,
          terrain: 'deep forrest'
        });
      }
    });
  }
  exports.createDefaultProvinces = createDefaultProvinces;

}());

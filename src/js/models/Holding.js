//app/models/Holding.js
(function () {
  'use strict';
  var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

  var holdingSchema = mongoose.Schema({
    type    : String,
    level   : Number,
    province: {type: Schema.Types.ObjectId, ref: 'Province'},
    name    : String,
    owner   : String,
    display : String,
    abbr    : String
  });

  var Holding = mongoose.model('Holding', holdingSchema);

  function createDefaultHoldings() {
    Holding.find({}).exec(function (err, collection) {
      if (collection.length === 0) {
        Holding.create({
          type   : 'guild',
          level  : 2,
          name   : 'lindoriapank',
          owner  : 'tsunsun',
          display: 'Lindoria Pank',
          abbr   : 'LP'
        });
        Holding.create({
          type   : 'law',
          level  : 3,
          name   : 'lindoriavahtkond',
          owner  : 'mauza',
          display: 'Lindoria Vahtkond',
          abbr   : 'LV'
        });
        Holding.create({
          type   : 'temple',
          level  : 3,
          name   : 'malhureuvalgus',
          owner  : 'arnand',
          display: 'Malhureu Valgus',
          abbr   : 'MV'
        });
      }
    });
  }

  exports.createDefaultHoldings = createDefaultHoldings;
}());
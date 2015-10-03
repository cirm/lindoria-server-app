//app/models/Domain.js
(function () {
  'use strict';
  var mongoose = require('mongoose')
    , Schema   = mongoose.Schema;

  var domainSchema = mongoose.Schema({
    name     : {
      type    : String,
      required: '{PATH} is required!',
      unique  : true
    },
    ruler    : String,
    assets   : {
      treasury: Number,
      court   : Number
    },
    might    : [String],
    region   : {
      name   : String,
      abbr   : String,
      display: String
    },
    display  : String,
    abbr     : String,
    provinces: [
      {type: Schema.Types.ObjectId, ref: 'Province'}
    ]
  });

  var Domain = mongoose.model('Domain', domainSchema);

  function createDefaultDomains() {
    Domain.find({}).exec(function (err, collection) {
      if (collection.length === 0) {
        Domain.create({
          name   : 'lindoriakuningriik',
          ruler  : 'Mauza',
          assets : {
            treasury: 320,
            court   : 2
          },
          region : {
            name   : 'deimerliniorg',
            display: 'Deimerlini Org',
            abbr   : 'DO'
          },
          display: 'Lindoria Kuningriik',
          abbr   : 'LK'
        });
      }
    });
  }

  exports.createDefaultDomains = createDefaultDomains;
}());
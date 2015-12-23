(function () {
  'use strict';

  exports.persons = [
    {
      pname:   "mauza",
      display: "Mauza"
    },
    {
      pname:   "tsunsun",
      display: "Balis Avarona"
    }];

  exports.domains = [
    {
    dname:    "lindoria",
    regent:   "mauza",
    display:  "Lindoria Kuningriik",
    abbr:     "LK",
    treasurt: 10
  }, {
      dname: "shalindar",
      regent: "",
      display: "Shalindari vennaskond",
      abbr: "SLV",
      treasury: 0
    }];

  exports.provinces = [
    {
      pname: "vlindoria",
      display:"Vana-Lindoria",
      level: 4,
      regent: "mauza",
      loyalty: 3,
      domain: "lindoria",
      visible: true,
      abbr: "VLD"
    },
    {
      pname: "plindoria",
      display: "Põhja-Lindoria",
      level: 2,
      regent: "tsunsun",
      loyalty: 2,
      domain: "lindoria",
      visible: true,
      abbr: "PLD"
    }];

})();
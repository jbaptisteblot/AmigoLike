'use strict';

module.exports = function(Travel) {
  Travel.search = function(dateDepart, lieuDepart, lieuArrivee, cb) {
    Travel.find({'include': 'trips'}).then(function(travels) {
      var foundTravels = [];
      travels.forEach(function(travelObj) {
        var travelJson = travelObj.toJSON();
        var availableBegin = false;
        var availableEnd = false;
        travelJson.trips.forEach(function(trip) {
          if (trip.beginLocation === lieuDepart)
            availableBegin = true;
          if (trip.endLocation === lieuArrivee)
            availableEnd = true;
        });
        if (availableBegin && availableEnd) {
          foundTravels.push(travelJson);
        }
      });
      cb(null, foundTravels);
    });
  };

  Travel.remoteMethod('search', {
    accepts: [
            {arg: 'dateDepart', type: 'string'},
            {arg: 'lieuDepart', type: 'string'},
            {arg: 'lieuArrivee', type: 'string'},
    ],
    returns: {arg: 'travel', type: 'travel'},
  });
};

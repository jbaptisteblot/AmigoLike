'use strict';

module.exports = function(Travel) {
  Travel.search = function(dateDepart, lieuDepart, lieuArrivee, cb) {
    Travel.find({'include': {'trips': 'reservations'}}).then(function(travels) {
      var foundTravels = [];
      travels.forEach(function(travelObj) {
        var travelJson = travelObj.toJSON();
        let nextLocationWanted = lieuDepart;
        let travelFound = false;

        travelJson.price = 0;
        travelJson.remainingPlaces = travelJson.numberPassengers;

        travelJson.trips.forEach(function(trip) {
          let remainingPlaces = travelJson.numberPassengers;
          if (trip.reservations !== undefined) {
            remainingPlaces -= trip.reservations.length;
          }
          trip.reservations = null;
          if (trip.beginLocation === nextLocationWanted &&
            remainingPlaces > 0) {
            // necessaryTrip.push(trip.id);
            travelJson.remainingPlaces = Math.min(travelJson.remainingPlaces,
              remainingPlaces);

            travelJson.price += trip.price;
            nextLocationWanted = trip.endLocation;
            if (nextLocationWanted === lieuArrivee) {
              travelFound = true;
            }
          }
        });
        if (travelFound) {
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

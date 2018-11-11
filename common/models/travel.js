'use strict';
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
function getName(name) {
  name = name.toLowerCase().trim();
  name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  name.replace(' ', '');
  return name;
}

module.exports = function(Travel) {
  Travel.search = function(dateDepart, lieuDepart, lieuArrivee, cb) {
    Travel.find({'include': {'trips': 'reservations'}}).then(function(travels) {
      let foundTravels = [];
      travels.forEach(function(travelObj) {
        let travelJson = travelObj.toJSON();
        let nextLocationWanted = lieuDepart;
        let travelFound = false;

        travelJson.price = 0;
        travelJson.remainingPlaces = travelJson.numberPassengers;
        let dateDepartObj = new Date(dateDepart);
        // Offset de timezone
        dateDepartObj.setTime(dateDepartObj.getTime() +
          dateDepartObj.getTimezoneOffset() * 60 * 1000);

        travelJson.trips.forEach(function(trip) {
          let remainingPlaces = travelJson.numberPassengers;
          if (trip.reservations !== undefined) {
            remainingPlaces -= trip.reservations.length;
          }

          trip.reservations = null;
          if (getName(trip.beginLocation) === getName(nextLocationWanted) &&
            remainingPlaces > 0) {
            travelJson.remainingPlaces = Math.min(travelJson.remainingPlaces,
              remainingPlaces);

            travelJson.price += trip.price;
            nextLocationWanted = trip.endLocation;
            if (nextLocationWanted === lieuArrivee) {
              travelFound = true;
            }
          }
        });
        if (travelJson.trips == null ||
          travelJson.trips.length === 0 ||
          !sameDay(dateDepartObj, new Date(travelJson.trips[0].beginDate)))
          travelFound = false;
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

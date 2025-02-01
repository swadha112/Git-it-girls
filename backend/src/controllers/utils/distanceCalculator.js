const geolib = require('geolib');

// Function to calculate the distance between two coordinates using geolib
const calculateDistance = (destination, source) => {
  return geolib.getDistance(
    { latitude: destination.lat, longitude: destination.lng },
    { latitude: source.lat, longitude: source.lng }
  );
};

module.exports = {
  calculateDistance,
};



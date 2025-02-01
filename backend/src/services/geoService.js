const axios = require('axios');

// Function to geocode a destination using Nominatim (OpenStreetMap)
const geocodeDestination = async (destination) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: destination,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'SupplyChainIQ (aadharam2004@gmail.com)'
      }
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } else {
      throw new Error('No location found for the provided destination');
    }
  } catch (err) {
    //throw new Error('Error fetching geocode data');
    console.error('Error fetching geocode data:', err.message || err);
    throw new Error('Error fetching geocode data');
  }
};

// Haversine formula to calculate distance between two points (lat, lng) on the Earth
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Convert degrees to radians
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Function to get the nearest source based on the destination coordinates
const getNearestSource = (destination, plantSources) => {
  let nearestSource = null;
  let shortestDistance = Infinity;

  // Iterate through each plant and calculate the distance to the destination
  plantSources.forEach((plant) => {
    const distance = calculateDistance(
      plant.location.lat,
      plant.location.lng,
      destination.lat,
      destination.lng
    );

    // If the current plant is closer, update the nearest source
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestSource = plant;
    }
  });

  return nearestSource;
};

module.exports = { geocodeDestination, getNearestSource };
